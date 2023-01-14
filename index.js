// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const settings = {
    backgroundColor: "#ffffff",
    lineColor: "#000000",
    lineCount: 1000,
    lineWidth: 20,
    maxLineLength: 10,
    allowDifferentLineLengths: true,
    allowDiagonals: "yes",
    beginInCenter: true,
    outsideResetsToBeginning: true,
    mirror: true,
    drawLive: false
};
const set = (key, value)=>{
    settings[key] = value;
};
const sections = [
    {
        name: "Colors",
        rows: [
            {
                key: "backgroundColor",
                name: "Background color",
                value: {
                    type: "color"
                }
            },
            {
                key: "lineColor",
                name: "Line color",
                value: {
                    type: "color"
                }
            }, 
        ]
    },
    {
        name: "Lines",
        rows: [
            {
                key: "lineCount",
                name: "Line count",
                value: {
                    type: "number",
                    min: 1
                }
            },
            {
                key: "lineWidth",
                name: "Line width",
                value: {
                    type: "number",
                    min: 1
                }
            },
            {
                key: "maxLineLength",
                name: "Max line length",
                value: {
                    type: "number",
                    min: 1
                }
            },
            {
                key: "allowDifferentLineLengths",
                name: "Allow different line lengths",
                description: "If this is checked, line lengths will be between 1 and the max length. If this is unchecked, all lines will be the max length.",
                value: {
                    type: "checkbox"
                }
            },
            {
                key: "allowDiagonals",
                name: "Allow diagonal lines",
                description: "If this is No, only horizontal and vertical lines will be used. If this is Yes, horizontal, vertical, and diagonal lines will be used. If this is Only, only diagonal lines will be used.",
                value: {
                    type: "select",
                    options: [
                        "No",
                        "Yes",
                        "Only"
                    ]
                }
            },
            {
                key: "mirror",
                name: "Mirror lines",
                value: {
                    type: "checkbox"
                }
            },
            {
                key: "drawLive",
                name: "Draw live",
                description: "If this is checked, each line will be drawn separately, as if part of an animation. Tapping the page will stop an ongoing drawing. If this is unchecked, all lines will be drawn at once.<br><br><em>Live drawing will make the page use more energy and can be significant for high line counts</em>.",
                value: {
                    type: "checkbox"
                }
            }, 
        ]
    },
    {
        name: "Positioning",
        rows: [
            {
                key: "beginInCenter",
                name: "Begin in center",
                value: {
                    type: "checkbox"
                }
            },
            {
                key: "outsideResetsToBeginning",
                name: "Move to origin when out of view",
                description: "If this is checked, when a line would go outside of the view, drawing will begin from the first point created. If this is unchecked, new lines will be attempted until one doesn't go out of view.",
                value: {
                    type: "checkbox"
                }
            }, 
        ]
    }, 
];
const injectSettingsUI = (parent)=>{
    const br = ()=>document.createElement("br");
    const sectionUIs = sections.map((section)=>{
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        const rowUIs = section.rows.map((row)=>{
            const { key , name , description , value  } = row;
            const lhs = document.createElement("div");
            const h3 = document.createElement("h3");
            h3.textContent = name;
            lhs.append(h3);
            if (description !== undefined) {
                const p = document.createElement("p");
                p.innerHTML = description;
                lhs.append(br(), p);
            }
            const rhs = document.createElement("div");
            const { type  } = value;
            if (type === "select") {
                const selectedOption = settings[key];
                const select = document.createElement("select");
                const options = value.options.map((option)=>{
                    const ui = document.createElement("option");
                    const data = option.toLowerCase();
                    ui.textContent = option;
                    ui.setAttribute("value", data);
                    if (selectedOption === data) {
                        ui.setAttribute("selected", "selected");
                    }
                    return ui;
                });
                select.onchange = ()=>{
                    const [selectedValue] = [
                        ...select.options
                    ].filter((option)=>option.selected).map((option)=>option.value);
                    set(key, selectedValue);
                };
                select.append(...options);
                rhs.append(select);
            } else {
                const input = document.createElement("input");
                input.setAttribute("type", type);
                input.setAttribute("value", String(settings[key]));
                input.onpointerup = (event)=>{
                    event.stopPropagation();
                };
                if (type === "checkbox") {
                    input.checked = settings[key] === true;
                    input.onchange = ()=>{
                        set(key, input.checked);
                    };
                } else if (type === "number") {
                    input.setAttribute("inputmode", "numeric");
                    input.setAttribute("pattern", "[0-9]+");
                    const { min  } = value;
                    if (min !== undefined) {
                        input.setAttribute("min", String(min));
                    }
                    input.onchange = ()=>{
                        set(key, Number(input.value));
                    };
                } else if (type === "color") {
                    input.onchange = ()=>{
                        set(key, input.value);
                    };
                } else {
                    throw new Error(`Unhandled input type: ${type}`);
                }
                rhs.append(input);
            }
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
    p.innerHTML = "Source code available on <a href='https://github.com/davidsteinberg/yourschach'>GitHub</a>.";
    div.append(...sectionUIs, p, br(), br());
    parent.append(div);
};
const coin = ()=>{
    return Math.random() < 0.5;
};
const __int = (low, high)=>{
    const min = Math.ceil(low);
    const max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const rgb = (low = 0, high = 255)=>{
    const r = __int(low, high);
    const g = __int(low, high);
    const b = __int(low, high);
    return {
        r,
        g,
        b
    };
};
const color = (low = 0, high = 255)=>{
    const { r , g , b  } = rgb(low, high);
    return `rgb(${r}, ${g}, ${b})`;
};
const element = (array)=>{
    const high = array.length - 1;
    const index = __int(0, high);
    return array[index];
};
const __default = {
    coin,
    int: __int,
    rgb,
    color,
    element
};
const resetCanvas = (canvas, dimensions)=>{
    const context = canvas.getContext("2d");
    const { width , height  } = dimensions;
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    canvas.setAttribute("width", String(width));
    canvas.setAttribute("height", String(height));
    canvas.style.backgroundColor = settings.backgroundColor;
    context.strokeStyle = settings.lineColor;
    context.lineWidth = settings.lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
};
const buildCoordinateData = (dimensions)=>{
    const { width , height  } = dimensions;
    let x = width / 2;
    let y = height / 2;
    if (!settings.beginInCenter) {
        x = __default.int(1, width - 1);
        y = __default.int(1, height - 1);
    }
    return {
        origin: {
            x,
            y
        },
        last: {
            x,
            y
        },
        max: {
            x: width,
            y: height
        }
    };
};
const addLine = (context, coordinateData)=>{
    const { origin , last , max  } = coordinateData;
    let alterX = true;
    let alterY = true;
    const { allowDiagonals  } = settings;
    if (allowDiagonals === "only") {
        alterX = true;
        alterY = true;
    } else if (allowDiagonals === "no") {
        if (__default.coin()) {
            alterX = true;
            alterY = false;
        } else {
            alterX = false;
            alterY = true;
        }
    } else if (allowDiagonals === "yes") {
        alterX = __default.coin();
        alterY = __default.coin();
        if (!alterX && !alterY) {
            if (__default.coin()) {
                alterX = true;
            } else {
                alterY = true;
            }
        }
    } else {
        console.error("Unhandled diagonal setting", allowDiagonals);
    }
    const { x , y  } = last;
    let newX = x;
    let newY = y;
    const { allowDifferentLineLengths , maxLineLength  } = settings;
    const getDelta = ()=>{
        if (allowDifferentLineLengths) {
            let delta = __default.int(-maxLineLength, maxLineLength);
            if (delta === 0) {
                delta = __default.coin() ? -1 : 1;
            }
            return delta;
        }
        return __default.coin() ? -maxLineLength : maxLineLength;
    };
    while(true){
        if (alterX) {
            newX = x + getDelta();
        }
        if (alterY) {
            newY = y + getDelta();
        }
        if (newX <= 0 || newX >= max.x || newY <= 0 || newY >= max.y) {
            if (settings.outsideResetsToBeginning) {
                return origin;
            } else {
                continue;
            }
        }
        break;
    }
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(newX, newY);
    context.stroke();
    if (settings.mirror) {
        const mirrorLastX = max.x - x;
        const mirrorNewX = max.x - newX;
        context.beginPath();
        context.moveTo(mirrorLastX, y);
        context.lineTo(mirrorNewX, newY);
        context.stroke();
    }
    return {
        x: newX,
        y: newY
    };
};
const draw = (canvas, willDraw)=>{
    const { clientWidth , clientHeight  } = document.body;
    const dimensions = {
        width: clientWidth,
        height: clientHeight
    };
    const coordinateData = buildCoordinateData(dimensions);
    const context = canvas.getContext("2d");
    resetCanvas(canvas, dimensions);
    willDraw();
    if (!settings.drawLive) {
        const { lineCount  } = settings;
        for(let i = 0; i < lineCount; i += 1){
            coordinateData.last = addLine(context, coordinateData);
        }
        window.onpointerup = ()=>draw(canvas, willDraw);
        return;
    }
    let remainingLines = settings.lineCount;
    const onpointerup = ()=>{
        remainingLines = 0;
        window.onpointerup = ()=>draw(canvas, willDraw);
    };
    const step = ()=>{
        remainingLines -= 1;
        if (remainingLines < 0) {
            console.log("Stopping, reached line count");
            onpointerup();
            return;
        }
        coordinateData.last = addLine(context, coordinateData);
        requestAnimationFrame(step);
    };
    window.onpointerup = onpointerup;
    step();
};
const ui = {
    theme: document.querySelector('meta[name="theme-color"]'),
    welcome: document.querySelector("#welcome"),
    drawing: document.querySelector("#drawing"),
    canvas: document.querySelector("canvas"),
    controls: document.querySelector("#controls"),
    toggle: document.querySelector("#toggle")
};
const setColors = ()=>{
    ui.toggle.style.setProperty("--color", settings.lineColor);
    ui.theme.setAttribute("content", settings.backgroundColor);
};
ui.welcome.onpointerup = (event)=>{
    event.stopPropagation();
    ui.welcome.classList.add("hidden");
    ui.drawing.classList.remove("hidden");
    draw(ui.canvas, setColors);
};
ui.controls.onpointerup = (event)=>{
    event.stopPropagation();
};
ui.toggle.onpointerup = (event)=>{
    event.stopPropagation();
    const { controls , toggle  } = ui;
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
