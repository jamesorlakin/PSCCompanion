package com.psccompanion;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import java.util.Calendar;

public class StudentNoticesUtils {
    static public void setAlarm(Context context) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 5);
        long interval = 1000 * 60 * 60 * 2;

        AlarmManager aManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent serviceIntent = new Intent(context, StudentNoticesUtils.StartServiceReceiver.class);
        PendingIntent servicePendingIntent = PendingIntent.getBroadcast(context,
                1,
                serviceIntent,
                PendingIntent.FLAG_CANCEL_CURRENT);

        aManager.setRepeating(
                AlarmManager.RTC_WAKEUP,
                cal.getTimeInMillis(),
                interval,
                servicePendingIntent
        );
    }

    public static class StartServiceReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            Intent service = new Intent(context, StudentNoticesService.class);
            Bundle bundle = new Bundle();
            bundle.putString("update", "true");
            service.putExtras(bundle);

            StudentNoticesService.acquireWakeLockNow(context.getApplicationContext());
            context.getApplicationContext().startService(service);
        }
    }
}