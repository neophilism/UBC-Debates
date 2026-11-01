import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = ["index.html", "styles.css", "app.js", "contracts.js"];

/** Fixed source allowlist: no dependencies, environment values or engine source enter dist. */
export async function build(outputDir = resolve(root, "dist")) {
  const contents = new Map();
  for (const name of assets) {
    const source = resolve(root, "src", name);
    if (name.endsWith(".js")) execFileSync(process.execPath, ["--check", source], { env: {}, stdio: "pipe" });
    contents.set(name, await readFile(source));
  }
  await mkdir(outputDir, { recursive: true });
  const manifest = { version: 1, presentationContract: 1, engineIntegration: "unverified", assets: {} };
  for (const [name, bytes] of contents) {
    await writeFile(resolve(outputDir, name), bytes);
    manifest.assets[name] = createHash("sha256").update(bytes).digest("hex");
  }
  await writeFile(resolve(outputDir, "build-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await build();
  console.log("Built UBC Debates static foundation in dist/");
}
