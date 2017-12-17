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

        return timetableData.getJSONArray("timetable");
    }
}
