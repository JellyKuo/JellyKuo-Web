/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  astroCompressHTML: "html",
  tailwindStylesheet: "./src/styles/main.css",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: "wrangler.jsonc",
      options: {
        trailingComma: "none",
      },
    },
  ],
};
