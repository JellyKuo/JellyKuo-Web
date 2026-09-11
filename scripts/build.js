import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const buildArgs = process.argv.slice(2);
const buildEnv = {
  ASTRO_BUILD_DRAFTS: String(buildArgs.includes("--buildDrafts")),
  ASTRO_BUILD_FUTURE: String(buildArgs.includes("--buildFuture")),
};

run(process.execPath, ["scripts/themeGenerator.js"]);
run(process.execPath, ["scripts/jsonGenerator.js", ...buildArgs]);
run("astro", ["build", ...buildArgs], buildEnv);
run(process.execPath, ["scripts/llmsGenerator.js"]);
