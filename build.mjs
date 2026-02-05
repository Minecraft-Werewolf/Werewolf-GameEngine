import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",

  bundle: true,
  format: "esm",
  platform: "neutral",

  mainFields: ["module", "main"],

  external: ["@minecraft/server", "@minecraft/server-ui"],
});
