package com.psccompanion;

import android.graphics.Color;
import android.os.Build;
import android.view.Window;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PSCCompanion";
    }

    @Override
    protected void onStart() {
        super.onStart();

        // Set a nice blue status bar.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window w = getWindow();
            w.setStatusBarColor(Color.parseColor("#36648B"));
        }
    }
}
