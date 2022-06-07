const { clientWidth, clientHeight } = document.body;

const settings = {
  backgroundColor: "#ffffff",
  lineColor: "#000000",

  lineCount: Math.floor((clientWidth * clientHeight) / 4),
  lineWidth: 1,
  maxLineLength: 1,
  allowDifferentLineLengths: true,

  allowDiagonals: "yes",
  beginInCenter: true,
  outsideResetsToBeginning: true,
  mirror: true,

  drawLive: false,
};

type Settings = typeof settings;
type SettingsKey = keyof Settings;

const set = <K extends SettingsKey>(key: K, value: Settings[K]) => {
  settings[key] = value;
};

type Value = { type: "color" } | { type: "checkbox" } | {
  type: "number";
  min?: number;
} | { type: "select"; options: string[] };

type Row = {
  key: SettingsKey;
  name: string;
  description?: string;
  value: Value;
};

type Section = {
  name: string;
  rows: Row[];
};

// Settings UI
const sections: Section[] = [
  {
    name: "Colors",
    rows: [
      {
        key: "backgroundColor",
        name: "Background color",
        value: {
          type: "color",
        },
      },
      {
        key: "lineColor",
        name: "Line color",
        value: {
          type: "color",
        },
      },
    ],
  },
  {
    name: "Lines",
    rows: [
      {
        key: "lineCount",
        name: "Line count",
        value: {
          type: "number",
          min: 1,
        },
      },
      {
        key: "lineWidth",
        name: "Line width",
        value: {
          type: "number",
          min: 1,
        },
      },
      {
        // Technically, this is only correct in terms of horizontal/vertical length
        key: "maxLineLength",
        name: "Max line length",
        value: {
          type: "number",
          min: 1,
        },
      },
      {
        key: "allowDifferentLineLengths",
        name: "Allow different line lengths",
        description:
          "If this is checked, line lengths will be between 1 and the max length. If this is unchecked, all lines will be the max length.",
        value: {
          type: "checkbox",
        },
      },
      {
        key: "allowDiagonals",
        name: "Allow diagonal lines",
        description:
          "If this is No, only horizontal and vertical lines will be used. If this is Yes, horizontal, vertical, and diagonal lines will be used. If this is Only, only diagonal lines will be used.",
        value: {
          type: "select",
          options: ["No", "Yes", "Only"],
        },
      },
      {
        key: "mirror",
        name: "Mirror lines",
        value: {
          type: "checkbox",
        },
      },
      {
        key: "drawLive",
        name: "Draw live",
        description:
          "If this is checked, each line will be drawn separately, as if part of an animation. Tapping the page will stop an ongoing drawing. If this is unchecked, all lines will be drawn at once.<br><br><em>Live drawing will make the page use more energy and can be significant for high line counts</em>.",
        value: {
          type: "checkbox",
        },
      },
    ],
  },
  {
    name: "Positioning",
    rows: [
      {
        key: "beginInCenter",
        name: "Begin in center",
        value: {
          type: "checkbox",
        },
      },
      {
        key: "outsideResetsToBeginning",
        name: "Move to origin when out of view",
        description:
          "If this is checked, when a line would go outside of the view, drawing will begin from the first point created. If this is unchecked, new lines will be attempted until one doesn't go out of view.",
        value: {
          type: "checkbox",
        },
      },
    ],
  },
];

const injectSettingsUI = (parent: HTMLElement) => {
  const br = () => document.createElement("br");

  const sectionUIs = sections.map((section) => {
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    const rowUIs = section.rows.map((row) => {
      const { key, name, description, value } = row;

      // LHS
      const lhs = document.createElement("div");
      const h3 = document.createElement("h3");

      h3.textContent = name;
      lhs.append(h3);

      if (description !== undefined) {
        const p = document.createElement("p");
        p.innerHTML = description;
        lhs.append(br(), p);
      }

      // RHS
      const rhs = document.createElement("div");
      const { type } = value;

      // Selects
      if (type === "select") {
        const selectedOption = settings[key];
        const select = document.createElement("select");
        const options = value.options.map((option) => {
          const ui = document.createElement("option");
          const data = option.toLowerCase();

          ui.textContent = option;
          ui.setAttribute("value", data);

          if (selectedOption === data) {
            ui.setAttribute("selected", "selected");
          }

          return ui;
        });

        select.onchange = () => {
          const [selectedValue] = [...select.options]
            .filter((option) => option.selected)
            .map((option) => option.value);
          set(key, selectedValue);
        };

        select.append(...options);
        rhs.append(select);
      } else {
        // Inputs
        const input = document.createElement("input") as HTMLInputElement;

        input.setAttribute("type", type);
        input.setAttribute("value", String(settings[key]));

        input.onpointerup = (event) => {
          event.stopPropagation();
        };

        // Checkboxes
        if (type === "checkbox") {
          input.checked = settings[key] === true;
          input.onchange = () => {
            set(key, input.checked);
          };
        } else if (type === "number") {
          // Numbers
          input.setAttribute("inputmode", "numeric");
          input.setAttribute("pattern", "[0-9]+");

          const { min } = value;
          if (min !== undefined) {
            input.setAttribute("min", String(min));
          }

          input.onchange = () => {
            set(key, Number(input.value));
          };
        } else if (type === "color") {
          // Colors
          input.onchange = () => {
            set(key, input.value);
          };
        } else {
          throw new Error(`Unhandled input type: ${type}`);
        }

        rhs.append(input);
      }

      // Combine sides
      const div = document.createElement("div");

      div.classList.add("row");
      div.append(lhs, rhs);

      return div;
    });

    h1.textContent = section.name;
    div.append(h1, br(), ...rowUIs, br(), br());

    return div;
  });

  const div = document.createElement("div");
  const p = document.createElement("p");
  p.innerHTML =
    "Source code available on <a href='https://github.com/davidsteinberg/yourschach'>GitHub</a>.";

  div.append(...sectionUIs, p, br(), br());
  parent.append(div);
};

export { injectSettingsUI };
export default settings;
