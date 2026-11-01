/** UBC presentation contract v1. This is not a claimed upstream API schema. */
export const CONTRACT_VERSION = 1;
export const ENGINE_DEPENDENCY = Object.freeze({
  repository: "neophilism/Live-Debate-Engine",
  sourceRevision: null,
  apiVersion: null,
  integration: "unverified",
});

export const ROUTES = Object.freeze([
  Object.freeze({ id: "home", hash: "#/", label: "Overview", title: "A place for thoughtful debate" }),
  Object.freeze({ id: "program", hash: "#/program", label: "Program", title: "Debate program" }),
  Object.freeze({ id: "debates", hash: "#/debates", label: "Debates", title: "Explore debates" }),
  Object.freeze({ id: "speakers", hash: "#/speakers", label: "Speakers", title: "Meet the speakers" }),
  Object.freeze({ id: "participant", hash: "#/participant", label: "Participant area", title: "Participant area" }),
]);

/** Routes are a fixed allowlist; query/hash content is never interpreted as HTML or a URL. */
export function resolveRoute(hash) {
  if (hash === "" || hash === "#") return ROUTES[0];
  return ROUTES.find(route => route.hash === hash) ?? null;
}

/** All protected decisions belong upstream. The foundation has no network adapter. */
export function createEngineBoundary() {
  return Object.freeze({
    contractVersion: CONTRACT_VERSION,
    dependency: ENGINE_DEPENDENCY,
    async load(routeId) {
      if (!ROUTES.some(route => route.id === routeId)) throw new TypeError("Unknown route");
      return Object.freeze({
        contractVersion: CONTRACT_VERSION,
        state: "unavailable",
        reason: "engine_not_connected",
        data: null,
      });
    },
  });
}

export function viewModel(route, result) {
  if (!route || !ROUTES.includes(route)) throw new TypeError("Unknown route");
  if (result?.contractVersion !== CONTRACT_VERSION || result?.state !== "unavailable" ||
      result?.reason !== "engine_not_connected" || result?.data !== null) {
    throw new TypeError("Unsupported presentation result");
  }
  return Object.freeze({
    title: route.title,
    message: route.id === "participant"
      ? "Participant sign-in is not available yet. No session or permission has been granted."
      : "Live Debate Engine is not connected yet. Published program, debate and speaker information will appear here when available.",
    status: "Not connected",
  });
}
