import test from "node:test";
import assert from "node:assert/strict";

test("app navigation updates status, current link, title and focus without reflecting unknown routes", async () => {
  const nodes = new Map();
  function element() {
    return { textContent: "", dataset: {}, children: [], attributes: {}, events: {},
      append(child) { this.children.push(child); },
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      addEventListener(name, callback) { this.events[name] = callback; },
      querySelectorAll() { return this.children; },
      focus() { this.focused = true; },
    };
  }
  for (const selector of ["[data-navigation]", "[data-title]", "[data-message]", "[data-status]", ".skip", "main"]) {
    nodes.set(selector, element());
  }
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  const events = {};
  globalThis.document = { querySelector: selector => nodes.get(selector), createElement: element };
  globalThis.window = { location: { hash: "#/" }, addEventListener: (name, fn) => { events[name] = fn; } };
  const flush = () => new Promise(resolve => setImmediate(resolve));
  try {
    await import("../src/app.js");
    await flush();
    const nav = nodes.get("[data-navigation]");
    assert.equal(nav.children.length, 5);
    assert.equal(nav.children.filter(link => link.attributes["aria-current"] === "page").length, 1);
    let prevented = false;
    nodes.get(".skip").events.click({ preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(nodes.get("main").focused, true);
    assert.equal(window.location.hash, "#/");
    window.location.hash = "#/participant";
    events.hashchange(); await flush();
    assert.match(nodes.get("[data-message]").textContent, /No session or permission/);
    assert.equal(nodes.get("[data-title]").focused, true);
    window.location.hash = "#/<script>alert(1)</script>";
    events.hashchange(); await flush();
    assert.equal(nodes.get("[data-title]").textContent, "Page not found");
    assert.equal(document.title, "Page not found | UBC Debates");
    assert.equal(nav.children.some(link => link.attributes["aria-current"]), false);
  } finally {
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
  }
});
