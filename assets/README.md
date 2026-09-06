# Brand source art

`scripts/generate-app-assets.mjs` rasterises these into every icon and splash
slot the Android and iOS projects reference. Edit the SVGs here, never the
generated PNGs under `android/app/src/main/res` or `ios/App/App/Assets.xcassets`
- the script overwrites them.

```bash
npm run gen:assets
```

The mark is Lucide's `book-open-check`, the same glyph the site header uses, so
the launcher icon and the in-app wordmark are the same drawing.
