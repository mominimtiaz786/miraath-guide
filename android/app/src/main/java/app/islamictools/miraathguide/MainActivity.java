package app.islamictools.miraathguide;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /** Brand green (see src/styles/_tokens.css), painted behind the system bars. */
    private static final int STATUS_BAR_COLOR = Color.parseColor("#17483F");

    /**
     * Keeps the web content clear of the status and navigation bars.
     *
     * Android 15 (targetSdk 35) forces every app edge-to-edge: it ignores
     * StatusBar.setOverlaysWebView(false) and Window.setStatusBarColor, so the
     * WebView fills the whole screen. On its own that would be fine - except
     * Android's WebView reports env(safe-area-inset-*) as 0px, verified on
     * device, so the page has no way to reserve the space itself and the
     * sticky header would sit underneath the clock.
     *
     * Insetting the content view here restores the pre-15 behaviour on every
     * version at once, which is why the Capacitor config asks for the
     * overlaying WebView rather than trying to switch on API level.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        View content = findViewById(android.R.id.content);
        content.setBackgroundColor(STATUS_BAR_COLOR);
        ViewCompat.setOnApplyWindowInsetsListener(content, (view, windowInsets) -> {
            Insets bars = windowInsets.getInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
