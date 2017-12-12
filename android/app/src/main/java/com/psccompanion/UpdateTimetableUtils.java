package com.psccompanion;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import java.util.Calendar;

public class UpdateTimetableUtils {
    static public void setAlarm(Context context) {
        Calendar cal = Calendar.getInstance();
        if (cal.get(Calendar.HOUR_OF_DAY) >= 5) cal.add(Calendar.DAY_OF_WEEK, 1);
        cal.set(Calendar.HOUR_OF_DAY, 5);
        long interval = 1000 * 60 * 60 * 24;

        AlarmManager aManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent serviceIntent = new Intent(context, UpdateTimetableUtils.StartServiceReceiver.class);
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
            Intent service = new Intent(context, UpdateTimetableService.class);
            Bundle bundle = new Bundle();
            bundle.putString("update", "true");
            service.putExtras(bundle);

            UpdateTimetableService.acquireWakeLockNow(context.getApplicationContext());
            context.getApplicationContext().startService(service);
        }
    }

    public static class SetAlarmOnBootReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            UpdateTimetableUtils.setAlarm(context);
        }
    }
}
