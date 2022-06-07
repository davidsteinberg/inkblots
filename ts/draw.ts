import settings from "./settings.ts";
import { random } from "./deps.ts";

// Reset canvas
type Dimensions = {
  width: number;
  height: number;
};

const resetCanvas = (canvas: HTMLCanvasElement, dimensions: Dimensions) => {
  const context = canvas.getContext("2d")!;
  const { width, height } = dimensions;

  // Remove previous image
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  // Set size after clearing the previous size
  canvas.setAttribute("width", String(width));
  canvas.setAttribute("height", String(height));
  canvas.style.backgroundColor = settings.backgroundColor;

  // Must come after setting width and height of canvas
  context.strokeStyle = settings.lineColor;
  context.lineWidth = settings.lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
};

// Coordinates
type Coordinate = { x: number; y: number };
type CoordinateData = {
  origin: Coordinate;
  last: Coordinate;
  max: Coordinate;
};

const buildCoordinateData = (dimensions: Dimensions): CoordinateData => {
  const { width, height } = dimensions;

  // Start in the center, unless settings force random coordinates
  let x = width / 2;
  let y = height / 2;

  if (!settings.beginInCenter) {
    x = random.int(1, width - 1);
    y = random.int(1, height - 1);
  }

  return {
    origin: { x, y },
    last: { x, y },
    max: {
      x: width,
      y: height,
    },
  };
};

// Add line
const addLine = (
  context: CanvasRenderingContext2D,
  coordinateData: CoordinateData,
): Coordinate => {
  const { origin, last, max } = coordinateData;

  let alterX = true;
  let alterY = true;

  const { allowDiagonals } = settings;
  if (allowDiagonals === "only") {
    // Alter both axes if only using diagonals
    alterX = true;
    alterY = true;
  } else if (allowDiagonals === "no") {
    // Alter only one axis if never using diagonals
    if (random.coin()) {
      alterX = true;
      alterY = false;
    } else {
      alterX = false;
      alterY = true;
    }
  } else if (allowDiagonals === "yes") {
    // Allow both axes to be altered if diagonals are allowed
    alterX = random.coin();
    alterY = random.coin();

    // Make sure at least one axis is changed
    if (!alterX && !alterY) {
      if (random.coin()) {
        alterX = true;
      } else {
        alterY = true;
      }
    }
  } else {
    console.error("Unhandled diagonal setting", allowDiagonals);
  }

  // Pick a new coordinate
  const { x, y } = last;
  let newX = x;
  let newY = y;

  const { allowDifferentLineLengths, maxLineLength } = settings;
  const getDelta = () => {
    if (allowDifferentLineLengths) {
      let delta = random.int(-maxLineLength, maxLineLength);
      if (delta === 0) {
        delta = random.coin() ? -1 : 1;
      }
      return delta;
    }

    return random.coin() ? -maxLineLength : maxLineLength;
  };

  while (true) {
    // Alter x and y as needed
    if (alterX) {
      newX = x + getDelta();
    }

    if (alterY) {
      newY = y + getDelta();
    }

    // When a line will go outside of the page
    if (newX <= 0 || newX >= max.x || newY <= 0 || newY >= max.y) {
      // Either reset to center
      if (settings.outsideResetsToBeginning) {
        return origin;
      } else {
        // Or try a new line
        continue;
      }
    }

    break;
  }

  // Draw line
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(newX, newY);
  context.stroke();

  // Draw mirrored line if needed
  if (settings.mirror) {
    const mirrorLastX = max.x - x;
    const mirrorNewX = max.x - newX;

    context.beginPath();
    context.moveTo(mirrorLastX, y);
    context.lineTo(mirrorNewX, newY);
    context.stroke();
  }

  // Return new coordinate to start from
  return { x: newX, y: newY };
};

// Draw
const draw = (canvas: HTMLCanvasElement, willDraw: () => void) => {
  // Build data
  const { clientWidth, clientHeight } = document.body;
  const dimensions = { width: clientWidth, height: clientHeight };
  const coordinateData = buildCoordinateData(dimensions);
  const context = canvas.getContext("2d")!;

  // Reset canvas and allow caller to perform pre-draw action
  resetCanvas(canvas, dimensions);
  willDraw();

  // If not animating
  if (!settings.drawLive) {
    // Add lines
    const { lineCount } = settings;
    for (let i = 0; i < lineCount; i += 1) {
      coordinateData.last = addLine(context, coordinateData);
    }

    // Tap for new image
    window.onpointerup = () => draw(canvas, willDraw);

    return;
  }

  // Count down to 0 from line count
  let remainingLines = settings.lineCount;

  // Set onpointerup on window,
  // in case window size is changed after drawing,
  // since the canvas wouldn't capture taps outside of itself
  const onpointerup = () => {
    // Set remainingLines to 0 to stop stepping
    remainingLines = 0;
    // Tap for new image
    window.onpointerup = () => draw(canvas, willDraw);
  };

  // Each step
  const step = () => {
    // Decrement remaining lines and stop if done
    remainingLines -= 1;
    if (remainingLines < 0) {
      console.log("Stopping, reached line count");
      onpointerup();
      return;
    }

    // Add a line and set up next animation step
    coordinateData.last = addLine(context, coordinateData);
    requestAnimationFrame(step);
  };

  // Tap to stop stepping
  window.onpointerup = onpointerup;
  // Start stepping
  step();
};

export default draw;
