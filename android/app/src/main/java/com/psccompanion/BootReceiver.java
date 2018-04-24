package com.psccompanion;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        UpdateTimetableUtils.setAlarm(context);
        StudentNoticesUtils.setAlarm(context);
    }
}