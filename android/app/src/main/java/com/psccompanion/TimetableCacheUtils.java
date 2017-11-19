package com.psccompanion;


import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;

public class TimetableCacheUtils {
    public static JSONArray getTimetable(Context context) throws JSONException {
        SharedPreferences preferences = context.getSharedPreferences("wit_player_shared_preferences", Context.MODE_PRIVATE);
        JSONObject timetableData = new JSONObject(preferences.getString("cache_UserTimetable", null));

        TimetableCacheUtils.setReminder(context);
        return timetableData.getJSONArray("timetable");
    }

    private static void setReminder(Context context) {
        AlarmManager aManager = (AlarmManager)context.getSystemService(Context.ALARM_SERVICE);

        Intent intent = new Intent(context, ReminderReceiver.class);
        if (PendingIntent.getBroadcast(context, 0,
                intent, PendingIntent.FLAG_NO_CREATE) == null) {
            PendingIntent alarmIntent = PendingIntent.getBroadcast(context, 0,
                    intent, PendingIntent.FLAG_CANCEL_CURRENT);

            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(System.currentTimeMillis());
            calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
            calendar.set(Calendar.HOUR_OF_DAY, 6);
            calendar.set(Calendar.MINUTE, 45);

            aManager.setRepeating(AlarmManager.RTC, calendar.getTimeInMillis(),
                    1000 * 60 * 60 * 24 * 7, alarmIntent);
        }
    }

    public static class ReminderReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(System.currentTimeMillis());
            if (calendar.get(Calendar.DAY_OF_WEEK) == Calendar.MONDAY) {
                NotificationManager nManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                Notification.Builder nBuilder = new Notification.Builder(context);
                nBuilder.setContentTitle(context.getString(R.string.timetableReminderTitle));
                nBuilder.setContentText(context.getString(R.string.timetableReminderText));
                nBuilder.setSmallIcon(R.drawable.notification_icon);

                PendingIntent openIntent = PendingIntent.getActivity(context,
                        0,
                        new Intent(context, MainActivity.class),
                        PendingIntent.FLAG_UPDATE_CURRENT);
                nBuilder.setAutoCancel(true);
                nBuilder.setContentIntent(openIntent);

                Notification.BigTextStyle nLargeText = new Notification.BigTextStyle();
                nLargeText.bigText(context.getString(R.string.timetableReminderText));
                nBuilder.setStyle(nLargeText);

                nManager.notify(0, nBuilder.build());
            }
        }
    }
}
