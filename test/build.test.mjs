import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { build } from "../scripts/build.mjs";

test("clean static build is deterministic, self-contained and does not embed environment secrets", async t => {
  const dir = await mkdtemp(join(tmpdir(), "ubc-build-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const secret = "synthetic-NEVER-EMBED-env-value";
  process.env.UBC_TEST_SECRET = secret;
  try {
    const first = await build(dir);
    const second = await build(dir);
    assert.deepEqual(first, second);
    assert.deepEqual((await readdir(dir)).sort(), ["app.js", "build-manifest.json", "contracts.js", "index.html", "styles.css"]);
    for (const [name, hash] of Object.entries(first.assets)) {
      const bytes = await readFile(join(dir, name));
      assert.equal(createHash("sha256").update(bytes).digest("hex"), hash);
      assert.equal(bytes.toString().includes(secret), false);
    }
    const html = await readFile(join(dir, "index.html"), "utf8");
    assert.match(html, /connect-src 'none'/);
    assert.match(html, /type="module" src="\.\/app.js"/);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<noscript>/);
    assert.equal(first.engineIntegration, "unverified");
  } finally { delete process.env.UBC_TEST_SECRET; }
});
