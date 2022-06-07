# Yourschach

Yourschach is a site that generates random "inkblots" based on customizable
settings.

By default, a high number of thin/short lines are used, causing clustered lines
to create filled-in shapes. You can change colors, line and positioning
attributes, and whether or not the image is mirrored ([Rorschach][1] style). You
can also choose to have the image drawn line-by-line.

### Implementation

Drawing is done using the [Canvas API][2]. On each draw, the canvas is stretched
across the entire page (so changing orientation between draws is okay), and the
colors from settings are applied. Starting from the center (or a random origin,
depending on settings), lines are made between random points (chosen based on
settings), until the line count is reached (or the canvas is tapped during an
animation). See [draw.ts][3] for the source.

### Bundling

The site's script, `index.js`, is bundled from the TypeScript source in the `ts`
directory using this command:

`deno bundle ts/index.ts index.js`

The `deno.json` file is implicitly required, as it specifies dom-related
libraries to use when bundling.

### Future Directions

1. Build the UI using React. The data binding juggle in settings in particular
   makes this a good candidate for components with state hooks.

2. Offer a way for users to save an image (or SVG) of the current drawing. There
   could be a share button as well, so users could share images without having
   to explicitly save them.

3. Turn more aspects of drawing into settings, e.g. line cap, animation
   interval, etc.

[1]: https://en.wikipedia.org/wiki/Rorschach_test
[2]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[3]: ts/draw.ts
