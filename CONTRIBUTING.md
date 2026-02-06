# Contributing to Light My Scene

Thanks for your interest in contributing. This is a simple, zero-dependency project and we'd like to keep it that way.

## Ground Rules

- **No frameworks, no build tools, no npm.** This project is vanilla HTML, CSS, and JavaScript. That's intentional. See the [tech stack docs](.agent-os/product/tech-stack.md) for rationale.
- **Keep it light.** Total page size should stay under 50KB (HTML + CSS + JS combined).
- **No external dependencies.** No CDN links, no third-party libraries. Inline SVGs for icons, system fonts only.

## How to Contribute

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test on iPad Safari and at least one desktop browser
5. Commit using conventional commit format (`feat:`, `fix:`, `docs:`, etc.)
6. Open a pull request

## What We're Looking For

- New motion FX scenes (see Phase 5-6 in the roadmap)
- Performance improvements (especially for iPad)
- Accessibility improvements
- Bug fixes
- Documentation improvements

## What We're Not Looking For

- Adding React, Vue, Tailwind, or any framework
- Adding a build step or bundler
- Adding npm dependencies
- Major UI redesigns without discussion first

## Development Setup

No install needed. Serve the files with any static server:

```
npx serve .
```

Or just open `index.html` directly in a browser.

## Testing

Test your changes on:
- iPad Safari (primary target device)
- Desktop Chrome or Firefox
- Check that animations run at 60fps
- Verify fullscreen mode works
- Confirm touch interactions feel right

## Code Style

- 2 spaces for indentation
- ES6+ JavaScript (const/let, arrow functions, template literals)
- CSS follows existing patterns (check `style.css`)
- Keep functions small and focused
- Comments for the "why", not the "what"

## Reporting Issues

Open an issue on GitHub with:
- What you expected to happen
- What actually happened
- Device and browser you were using
- Screenshots if relevant

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
