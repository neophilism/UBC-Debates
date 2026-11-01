import test from "node:test";
import assert from "node:assert/strict";
import { ROUTES, resolveRoute, createEngineBoundary, viewModel } from "../src/contracts.js";

test("fixed routes resolve without reflecting query, script or external URL input", () => {
  for (const route of ROUTES) assert.equal(resolveRoute(route.hash), route);
  for (const value of ["#/admin", "#/<script>", "https://evil.example", "#/participant?role=admin", "#/debates/../participant", null]) {
    assert.equal(resolveRoute(value), null);
  }
  assert.equal(resolveRoute(""), ROUTES[0]);
});

test("foundation cannot make network calls or grant protected access", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = () => { calls++; throw Error("Network forbidden"); };
  try {
    const engine = createEngineBoundary();
    assert.equal(engine.dependency.repository, "neophilism/Live-Debate-Engine");
    assert.equal(engine.dependency.sourceRevision, null);
    assert.equal(engine.dependency.apiVersion, null);
    for (const route of ROUTES) {
      const result = await engine.load(route.id);
      assert.deepEqual(result, { contractVersion: 1, state: "unavailable", reason: "engine_not_connected", data: null });
      assert.equal(viewModel(route, result).status, "Not connected");
    }
    await assert.rejects(engine.load("admin"), /Unknown route/);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});

test("component contract rejects unsupported versions and fabricated success data", () => {
  const result = { contractVersion: 1, state: "unavailable", reason: "engine_not_connected", data: null };
  for (const patch of [{ contractVersion: 2 }, { state: "ready" }, { reason: "authorized" }, { data: { token: "fake" } }]) {
    assert.throws(() => viewModel(ROUTES[0], { ...result, ...patch }), /Unsupported/);
  }
  assert.throws(() => viewModel({ id: "home" }, result), /Unknown route/);
});
