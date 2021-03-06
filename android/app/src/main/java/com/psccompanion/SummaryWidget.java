package com.psccompanion;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
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
            views.setOnClickPendingIntent(R.id.summaryLayout, PendingIntent.getActivity(context,
                    0, new Intent(context, MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT
            ));

            JSONArray timetable = TimetableCacheUtils.getTimetable(context);
            if (timetable.length() == 0) views.setTextViewText(R.id.summaryLessonTitle,
                    context.getString(R.string.summaryNothing));
            for (int i = 0; i < timetable.length(); i++) {

                boolean isLastEvent = i+1 == timetable.length();

                JSONObject event = timetable.getJSONObject(i);
                Date eventStart = new Date((long)event.getInt("Start")*1000);
                if ((now.before(eventStart) && !event.getBoolean("IsCancelled")) || isLastEvent) {

                    views.setTextViewText(R.id.summaryTitle, context.getString(R.string.summaryTitle));
                    if (isLastEvent) {
                        event = timetable.getJSONObject(0);
                        eventStart = new Date((long)event.getInt("Start")*1000);
                        views.setTextViewText(R.id.summaryTitle, context.getString(R.string.summaryTitleNextWeek));
                    }
                    views.setTextViewText(R.id.summaryLessonTitle, event.getString("Title"));

                    views.setTextViewText(R.id.summaryLessonStaff, event.getString("Staff"));

                    SimpleDateFormat eventDateFormatter = new SimpleDateFormat("h:mm a", Locale.getDefault());
                    views.setTextViewText(R.id.summaryLessonTime, eventDateFormatter.format(eventStart)
                            + " - " + event.getString("Room"));
                    break;
                }
            }
        } catch (Exception e) {
            Log.e("widget", e.getMessage() + "");
            views.setTextViewText(R.id.summaryTitle, context.getString(R.string.summaryError));
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

