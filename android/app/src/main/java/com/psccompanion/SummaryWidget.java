package com.psccompanion;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Implementation of App Widget functionality.
 */
public class SummaryWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {
        // TODO: Trigger widget updates at lesson boundaries.

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.summary_widget);
        Date now = new Date();
        try {
            SharedPreferences preferences = context.getSharedPreferences("wit_player_shared_preferences", Context.MODE_PRIVATE);
            JSONArray timetable = new JSONArray(preferences.getString("summaryTimetable", null));
            for (int i = 0; i < timetable.length(); i++) {

                JSONObject event = timetable.getJSONObject(i);
                Date eventStart = new Date((long)event.getInt("Start")*1000);
                if (now.before(eventStart)) {
                    views.setTextViewText(R.id.summaryLessonTitle, event.getString("Title"));

                    SimpleDateFormat eventDateFormatter = new SimpleDateFormat("h:mm a", Locale.getDefault());
                    views.setTextViewText(R.id.summaryLessonTime, eventDateFormatter.format(eventStart)
                            + " - " + event.getString("Room"));
                    break;
                }
            }
        } catch (Exception e) {
            views.setTextViewText(R.id.summaryTitle, "Unable to load! Is timetable sharing enabled?");
        }

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

