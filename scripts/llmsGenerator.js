import { glob } from "glob";
import { parse } from "node-html-parser";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import TurndownService from "turndown";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "../src/config/config.json");
const DIST_PATH = path.join(__dirname, "../dist");
const MANIFEST_PATH = path.join(__dirname, "../.json/llms-generated.json");

const DEFAULT_EXCLUDES = [
  "node_modules",
  "_astro",
  "404",
  "404.html",
  "**/*.xml",
  "**/*.txt",
];

const API_ROUTE_PREFIXES = ["/api/", "/_", "/cdn-cgi/"];

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error("config.json not found");
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  if (!config.llms) {
    throw new Error("llms configuration not found in config.json");
  }

  return config;
}

function getClientDir(distFolder) {
  const clientDir = path.join(distFolder, "client");
  return fs.existsSync(clientDir) ? clientDir : distFolder;
}

function normalizePattern(baseDir, pattern) {
  const cleanPattern = pattern.replace(/^\/+/, "");
  const fullPath = path.join(baseDir, cleanPattern);

  try {
    if (fs.statSync(fullPath).isDirectory()) {
      return path.join(fullPath, "**/*.html");
    }
  } catch {
    // Treat missing paths as glob patterns.
  }

  return fullPath;
}

async function discoverHtmlFiles(clientDir, excludePatterns, includePatterns) {
  const patterns =
    includePatterns?.length > 0
      ? includePatterns.map((pattern) => normalizePattern(clientDir, pattern))
      : [path.join(clientDir, "**/*.html")];

  const ignore = [
    ...DEFAULT_EXCLUDES.map((pattern) => path.join(clientDir, pattern)),
    ...(excludePatterns || []).map((pattern) =>
      normalizePattern(clientDir, pattern),
    ),
  ];

  const files = await glob(patterns, { ignore, absolute: true });
  return files
    .filter((file) => fs.statSync(file).isFile() && file.endsWith(".html"))
    .sort();
}

function fileToUrlPath(filePath, clientDir) {
  const relativePath = path.relative(clientDir, filePath);
  let urlPath = relativePath.replaceAll(path.sep, "/").replace(/\.html$/, "");

  if (urlPath.endsWith("/index") || urlPath === "index") {
    urlPath = urlPath.replace(/\/index$/, "").replace(/^index$/, "");
  }

  return `/${urlPath}`;
}

function isApiRoute(urlPath) {
  return API_ROUTE_PREFIXES.some((prefix) => urlPath.startsWith(prefix));
}

function getTitle(root, titleSelector) {
  const selectors = [titleSelector, "h1", "h2", "h3", "title"].filter(Boolean);

  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element?.text?.trim()) {
      return element.text.trim();
    }
  }

  return "";
}

function getContentElement(root, contentSelector) {
  const selectors = [contentSelector, "main", "body", "html"].filter(Boolean);

  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) {
      return element;
    }
  }

  return null;
}

function processHtml(html, llmsConfig) {
  const root = parse(html);
  const redirect = root.querySelector('meta[http-equiv="refresh"]');
  if (redirect) {
    return null;
  }

  const title = getTitle(root, llmsConfig.title_selector);
  const description =
    root.querySelector('meta[name="description"]')?.getAttribute("content") ||
    "";
  const contentElement = getContentElement(root, llmsConfig.content_selector);

  if (!contentElement) {
    return { title, description, content: "" };
  }

  contentElement
    .querySelectorAll("script, style, noscript, iframe, svg")
    .forEach((element) => element.remove());

  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  });

  turndownService.addRule("removeChrome", {
    filter: ["nav", "footer", "header", "aside"],
    replacement: () => "",
  });

  return {
    title,
    description,
    content: turndownService.turndown(contentElement.innerHTML),
  };
}

function generateMarkdownFile(page, siteUrl) {
  const url = `${siteUrl}${page.urlPath}`.replace(/(?<=.)\/$/, "");
  let markdown = "---\n";
  markdown += `title: ${JSON.stringify(page.title)}\n`;
  markdown += `url: ${JSON.stringify(url)}\n`;

  if (page.description) {
    markdown += `description: ${JSON.stringify(page.description)}\n`;
  }

  markdown += "---\n\n";
  markdown += page.content;
  return markdown;
}

function groupPages(pages) {
  return pages.reduce((groups, page) => {
    const parts = page.urlPath.split("/").filter(Boolean);
    const group = parts.length === 0 ? "Home" : parts[0];
    groups[group] ||= [];
    groups[group].push(page);
    return groups;
  }, {});
}

function generateLlmsTxtContent(
  pages,
  siteUrl,
  siteName,
  siteDescription,
  generateIndividualMd,
) {
  let content = `# ${siteName}\n\n`;

  if (siteDescription) {
    content += `> ${siteDescription}\n\n`;
  }

  content +=
    "This file helps language models discover the most useful content on this site.\n\n";

  const groupedPages = groupPages(pages);
  const groups = Object.keys(groupedPages).sort((left, right) => {
    if (left === "Home") return -1;
    if (right === "Home") return 1;
    return left.localeCompare(right);
  });

  for (const group of groups) {
    content += `## ${group.charAt(0).toUpperCase() + group.slice(1)}\n\n`;

    for (const page of groupedPages[group]) {
      const destination = generateIndividualMd
        ? page.urlPath === "/"
          ? "/index.md"
          : `${page.urlPath}.md`
        : page.urlPath;
      const linkUrl = `${siteUrl}${destination}`.replace(/([^:])\/\//g, "$1/");
      const linkText = page.title || page.urlPath;
      content += page.description
        ? `- [${linkText}](${linkUrl}): ${page.description}\n`
        : `- [${linkText}](${linkUrl})\n`;
    }

    content += "\n";
  }

  return content;
}

function generateLlmsFullTxtContent(pages, siteUrl, siteName) {
  let content = `# ${siteName}\n\nURL: ${siteUrl}\n\n`;

  pages.forEach((page, index) => {
    const url = `${siteUrl}${page.urlPath}`.replace(/(?<=.)\/$/, "");
    content += `## ${page.title}\n\nURL: ${url}\n\n`;

    if (page.description) {
      content += `${page.description}\n\n`;
    }

    content += page.content;
    if (index < pages.length - 1) {
      content += "\n\n---\n\n";
    }
  });

  return content;
}

function cleanPreviouslyGeneratedMarkdown(clientDir) {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return;
  }

  const generatedFiles = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const resolvedClientDir = path.resolve(clientDir) + path.sep;

  for (const relativePath of generatedFiles) {
    const outputPath = path.resolve(clientDir, relativePath);
    if (outputPath.startsWith(resolvedClientDir) && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  }
}

function writeGenerationManifest(generatedFiles) {
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify(generatedFiles, null, 2)}\n`,
    "utf8",
  );
}

async function generateLlmsFiles() {
  const config = getConfig();
  const llmsConfig = config.llms;

  if (!fs.existsSync(DIST_PATH)) {
    throw new Error("dist/ folder does not exist. Run 'astro build' first.");
  }

  const clientDir = getClientDir(DIST_PATH);
  const outputMode = clientDir === DIST_PATH ? "static" : "adapter client";
  console.log(`LLM output mode: ${outputMode}`);

  const htmlFiles = await discoverHtmlFiles(
    clientDir,
    llmsConfig.exclude,
    llmsConfig.include,
  );
  const pages = [];
  const seenPaths = new Set();

  for (const filePath of htmlFiles) {
    try {
      const urlPath = fileToUrlPath(filePath, clientDir);
      if (isApiRoute(urlPath) || seenPaths.has(urlPath)) {
        continue;
      }

      const html = fs.readFileSync(filePath, "utf8");
      const pageData = processHtml(html, llmsConfig);
      if (!pageData) {
        continue;
      }

      if (!pageData.title) {
        console.warn(`No title found for ${urlPath}; skipping`);
        continue;
      }

      seenPaths.add(urlPath);
      pages.push({ urlPath, ...pageData });
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }

  pages.sort((left, right) => {
    if (left.urlPath === "/") return -1;
    if (right.urlPath === "/") return 1;
    return left.urlPath.localeCompare(right.urlPath);
  });

  const siteUrl = config.site.base_url.replace(/\/$/, "");
  const generatedMarkdown = [];
  cleanPreviouslyGeneratedMarkdown(clientDir);

  if (llmsConfig.generate_individual_md) {
    for (const page of pages) {
      const relativePath =
        page.urlPath === "/"
          ? "index.md"
          : `${page.urlPath.replace(/^\//, "")}.md`;
      const outputPath = path.join(clientDir, relativePath);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, generateMarkdownFile(page, siteUrl), "utf8");
      generatedMarkdown.push(relativePath);
    }
  }

  writeGenerationManifest(generatedMarkdown);

  if (llmsConfig.generate_llms_txt) {
    fs.writeFileSync(
      path.join(clientDir, "llms.txt"),
      generateLlmsTxtContent(
        pages,
        siteUrl,
        config.site.title,
        config.metadata?.meta_description || "",
        llmsConfig.generate_individual_md,
      ),
      "utf8",
    );
  }

  if (llmsConfig.generate_llms_full_txt) {
    fs.writeFileSync(
      path.join(clientDir, "llms-full.txt"),
      generateLlmsFullTxtContent(pages, siteUrl, config.site.title),
      "utf8",
    );
  }

  console.log(`LLM artifacts generated for ${pages.length} pages`);
}

generateLlmsFiles().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
