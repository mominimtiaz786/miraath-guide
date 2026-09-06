# Android build toolchain for this project.
#
# Nothing here is installed system-wide and nothing is on your PATH until you
# source this file, so it acts as a per-shell environment rather than a global
# install:
#
#   source scripts/android-env.sh
#   npm run sync:app && (cd android && ./gradlew assembleDebug)
#
# Install locations (created by the one-time setup documented in the README):
#   ~/.local/opt/jdk-21   Eclipse Temurin JDK 21 - AGP 8.7.2 needs 17+
#   ~/Android/Sdk         standard SDK path, so Android Studio finds it too

export JAVA_HOME="$HOME/.local/opt/jdk-21"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

if [ ! -x "$JAVA_HOME/bin/java" ]; then
  echo "android-env: no JDK at $JAVA_HOME - see the README's mobile section" >&2
fi
