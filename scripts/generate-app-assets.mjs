/**
 * Renders the app icon and splash screen into every slot the native projects
 * reference. Run with `npm run gen:assets` after editing assets/*.svg.
 *
 * This replaces @capacitor/assets, which pins a sharp version with no prebuilt
 * binary for current Node and so cannot install here.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Brand palette - kept in step with src/styles/_tokens.css.
const GREEN = '#17483F';
const IVORY = '#F7F4EA';
const GOLD = '#C39A52';

/**
 * Lucide `book-open-check` - the same glyph as the site header's brand icon.
 * Drawn on a 24x24 grid; the check stroke is picked out in gold.
 */
const GLYPH = `
    <path d="M12 21V7" />
    <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
    <path d="m16 12 2 2 4-4" stroke="${GOLD}" />`;

/** @param {{width:number,height:number,background?:string,glyphRatio:number}} opts */
function artwork({ width, height, background, glyphRatio }) {
  const glyph = Math.round(Math.min(width, height) * glyphRatio);
  const scale = glyph / 24;
  const x = (width - glyph) / 2;
  const y = (height - glyph) / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${background ? `<rect width="${width}" height="${height}" fill="${background}" />` : ''}
  <g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${IVORY}"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${GLYPH}
  </g>
</svg>`);
}

function circleMask(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`,
  );
}

async function emit(path, pipeline) {
  const file = join(ROOT, path);
  await mkdir(dirname(file), { recursive: true });
  await pipeline.png().toFile(file);
  console.log('  ' + path);
}

const LAUNCHER = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
// Adaptive icons are 108dp with only the inner ~72dp guaranteed visible, so the
// glyph is deliberately small inside a mostly empty, transparent square.
const FOREGROUND = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
const SPLASH_PORT = { mdpi: [320, 480], hdpi: [480, 800], xhdpi: [720, 1280], xxhdpi: [960, 1600], xxxhdpi: [1280, 1920] };
const SPLASH_LAND = { mdpi: [480, 320], hdpi: [800, 480], xhdpi: [1280, 720], xxhdpi: [1600, 960], xxxhdpi: [1920, 1280] };

async function main() {
  // --- Source art, checked in so the shapes are editable by hand ---
  console.log('assets/');
  await writeFile(join(ROOT, 'assets/icon.svg'), artwork({ width: 1024, height: 1024, background: GREEN, glyphRatio: 0.55 }));
  console.log('  assets/icon.svg');
  await writeFile(join(ROOT, 'assets/icon-foreground.svg'), artwork({ width: 432, height: 432, glyphRatio: 0.42 }));
  console.log('  assets/icon-foreground.svg');
  await writeFile(join(ROOT, 'assets/splash.svg'), artwork({ width: 2732, height: 2732, background: GREEN, glyphRatio: 0.2 }));
  console.log('  assets/splash.svg');

  const icon = artwork({ width: 1024, height: 1024, background: GREEN, glyphRatio: 0.55 });

  // --- iOS ---
  console.log('ios/');
  // flatten(): the App Store rejects a marketing icon with an alpha channel.
  await emit(
    'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png',
    sharp(icon).flatten({ background: GREEN }),
  );
  const iosSplash = artwork({ width: 2732, height: 2732, background: GREEN, glyphRatio: 0.2 });
  for (const name of ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']) {
    await emit(`ios/App/App/Assets.xcassets/Splash.imageset/${name}`, sharp(iosSplash));
  }

  // --- Android launcher icons ---
  console.log('android/');
  for (const [density, size] of Object.entries(LAUNCHER)) {
    await emit(`android/app/src/main/res/mipmap-${density}/ic_launcher.png`, sharp(icon).resize(size, size));
    await emit(
      `android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`,
      sharp(icon).resize(size, size).composite([{ input: circleMask(size), blend: 'dest-in' }]),
    );
  }
  for (const [density, size] of Object.entries(FOREGROUND)) {
    await emit(
      `android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`,
      sharp(artwork({ width: size, height: size, glyphRatio: 0.42 })),
    );
  }

  // --- Android splash ---
  for (const [density, [w, h]] of Object.entries(SPLASH_PORT)) {
    await emit(`android/app/src/main/res/drawable-port-${density}/splash.png`, sharp(artwork({ width: w, height: h, background: GREEN, glyphRatio: 0.28 })));
  }
  for (const [density, [w, h]] of Object.entries(SPLASH_LAND)) {
    await emit(`android/app/src/main/res/drawable-land-${density}/splash.png`, sharp(artwork({ width: w, height: h, background: GREEN, glyphRatio: 0.28 })));
  }
  await emit('android/app/src/main/res/drawable/splash.png', sharp(artwork({ width: 1280, height: 1920, background: GREEN, glyphRatio: 0.28 })));
  // Android 12+ draws only this icon over windowSplashScreenBackground.
  await emit('android/app/src/main/res/drawable/splash_icon.png', sharp(artwork({ width: 960, height: 960, glyphRatio: 0.45 })));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
