# Light My Scene

Turn any screen into a colored light source for photography. A fast, zero-dependency web app optimized for iPad and touch devices.

Inspired by the Aputure MC portable light.

## Features

**Color Selection**
- 6 quick-select presets (white, blue, green, red, yellow, pink)
- Hex code input with validation
- Native color picker
- Recent colors (last 5 custom colors)

**Motion FX Scenes**
- Police alert lights (red/blue flash)
- Fire flicker (warm orange/red randomized)
- Lightning storm (white flash bursts on dark)
- Speed control (slow, medium, fast)

**Controls**
- Intensity slider (dims output via overlay)
- Hide Controls mode for clean light surface
- Tap screen to bring controls back
- Keyboard shortcuts: Space (hide/show), 1-6 (presets)

**iPad Optimized**
- Touch-friendly controls (large tap targets)
- PWA support (add to home screen for standalone mode)
- Wake Lock API (prevents screen sleep)
- Works in both landscape and portrait

## Usage

1. Open the app in a browser
2. Select a color or motion FX scene
3. Adjust intensity as needed
4. Tap "Hide Controls" for a clean light surface
5. Tap anywhere to bring controls back

**iPad standalone mode:** Open in Safari, tap Share, tap "Add to Home Screen". The app launches without browser chrome.

## Tech Stack

Vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

## Development

Serve the files with any static server:

```
npx serve .
```

Or open `index.html` directly in a browser.

## License

MIT
