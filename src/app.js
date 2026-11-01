import { ROUTES, resolveRoute, createEngineBoundary, viewModel } from "./contracts.js";

const boundary = createEngineBoundary();
const nav = document.querySelector("[data-navigation]");
const heading = document.querySelector("[data-title]");
const message = document.querySelector("[data-message]");
const status = document.querySelector("[data-status]");
let navigationVersion = 0;

document.querySelector(".skip").addEventListener("click", event => {
  event.preventDefault();
  document.querySelector("main").focus();
});

for (const route of ROUTES) {
  const link = document.createElement("a");
  link.href = route.hash;
  link.textContent = route.label;
  link.dataset.route = route.id;
  nav.append(link);
}

async function navigate(moveFocus = false) {
  const version = ++navigationVersion;
  const route = resolveRoute(window.location.hash);
  for (const link of nav.querySelectorAll("a")) {
    if (link.dataset.route === route?.id) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (!route) {
    heading.textContent = "Page not found";
    message.textContent = "Choose a page from the navigation to continue.";
    status.textContent = "Unavailable page";
    document.title = "Page not found | UBC Debates";
    if (moveFocus) heading.focus();
    return;
  }
  const model = viewModel(route, await boundary.load(route.id));
  if (version !== navigationVersion) return;
  heading.textContent = model.title;
  message.textContent = model.message;
  status.textContent = model.status;
  document.title = route.label + " | UBC Debates";
  if (moveFocus) heading.focus();
}

window.addEventListener("hashchange", () => { void navigate(true); });
void navigate();
