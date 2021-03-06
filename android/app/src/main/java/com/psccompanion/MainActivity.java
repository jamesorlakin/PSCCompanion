package com.psccompanion;

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
        UpdateTimetableUtils.setAlarm(this);
        StudentNoticesUtils.setAlarm(this);
        super.onStart();
    }
}
