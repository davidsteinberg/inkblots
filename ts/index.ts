import draw from "./draw.ts";
import settings, { injectSettingsUI } from "./settings.ts";

// UI
const ui = {
  theme: document.querySelector('meta[name="theme-color"]')!,
  welcome: document.querySelector("#welcome")! as HTMLElement,
  drawing: document.querySelector("#drawing")! as HTMLElement,
  canvas: document.querySelector("canvas")! as HTMLCanvasElement,
  controls: document.querySelector("#controls")! as HTMLElement,
  toggle: document.querySelector("#toggle")! as HTMLElement,
};

draw(ui.canvas, () => {});

// Set colors before each draw
const setColors = () => {
  ui.toggle.style.setProperty("--color", settings.lineColor);
  ui.theme.setAttribute("content", settings.backgroundColor);
};

// Welcome switches to drawing and draws
ui.welcome.onpointerup = (event) => {
  event.stopPropagation();

  ui.welcome.classList.add("hidden");
  ui.drawing.classList.remove("hidden");

  draw(ui.canvas, setColors);
};

// Controls taps shouldn't propagate
ui.controls.onpointerup = (event) => {
  event.stopPropagation();
};

// Toggle switches between controls and current layer
ui.toggle.onpointerup = (event) => {
  event.stopPropagation();

  const { controls, toggle } = ui;

  if (toggle.textContent === "x") {
    controls.classList.add("hidden");
    toggle.classList.remove("black");
    toggle.textContent = "=";
  } else {
    controls.classList.remove("hidden");
    toggle.classList.add("black");
    toggle.textContent = "x";
  }
};

injectSettingsUI(ui.controls);
