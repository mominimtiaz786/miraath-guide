#!/usr/bin/env bash
#
# One command from source change to installable APK.
#
#   npm run apk              build a debug APK
#   npm run apk -- --install build it, then push it to a connected device
#
# Sources the toolchain itself, so it works from any shell without you having
# to remember to `source scripts/android-env.sh` first.

set -euo pipefail
cd "$(dirname "$0")/.."

INSTALL=false
for arg in "$@"; do
  case "$arg" in
    --install) INSTALL=true ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

# shellcheck source=./android-env.sh
source scripts/android-env.sh

if [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "No JDK at $JAVA_HOME. See the README's 'Android build toolchain' section." >&2
  exit 1
fi

echo "==> 1/3  Angular static build"
npm run build:app

# Copies the web bundle into android/ AND re-reads capacitor.config.ts, so a
# plugin or config change is picked up here rather than silently going stale.
echo "==> 2/3  Capacitor sync"
npx cap sync android

echo "==> 3/3  Gradle"
(cd android && ./gradlew assembleDebug)

APK=android/app/build/outputs/apk/debug/app-debug.apk
OUT="miraath-guide-debug.apk"
cp "$APK" "$OUT"

echo
echo "APK ready: $(pwd)/$OUT  ($(du -h "$OUT" | cut -f1))"

if [ "$INSTALL" = true ]; then
  if [ -z "$(adb devices | awk 'NR>1 && $2=="device"')" ]; then
    echo "No device connected - plug in a phone with USB debugging on, or start the emulator." >&2
    exit 1
  fi
  echo "==> installing"
  adb install -r "$APK"
  adb shell am start -n app.islamictools.miraathguide/.MainActivity >/dev/null
  echo "launched on device"
fi
