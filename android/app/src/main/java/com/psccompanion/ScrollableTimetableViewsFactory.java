package com.psccompanion;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ScrollableTimetableViewsFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context = null;
    private int appWidgetId;

    private List<JSONObject> timetableItems = new ArrayList<JSONObject>();

    public ScrollableTimetableViewsFactory(Context context, Intent intent)
    {
        this.context = context;
        appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
    }

    private void updateWidgetListView()
    {
        try {
            SharedPreferences preferences = context.getSharedPreferences("wit_player_shared_preferences",
                    Context.MODE_PRIVATE);
            JSONArray timetable = new JSONArray(preferences.getString("summaryTimetable", null));

            List<JSONObject> timetableItems = new ArrayList<JSONObject>();
            for (int i = 0; i < timetable.length(); i++) {
                timetableItems.add(timetable.getJSONObject(i));
            }

            this.timetableItems = timetableItems;
        } catch (Exception e) {
            Log.e("widget", e.toString());
        }
    }

    @Override
    public int getCount()
    {
        return timetableItems.size();
    }

    @Override
    public long getItemId(int position)
    {
        return position;
    }

    @Override
    public RemoteViews getLoadingView()
    {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public RemoteViews getViewAt(int position)
    {
        RemoteViews remoteView = new RemoteViews(context.getPackageName(),
                R.layout.scrollable_timetable_widget_item);

        try {
            JSONObject event = this.timetableItems.get(position);

            remoteView.setTextViewText(R.id.timetableLessonName, event.getString("Title"));

            Date eventStart = new Date((long)event.getInt("Start")*1000);
            Date eventEnd = new Date((long)event.getInt("End")*1000);
            SimpleDateFormat eventDateFormatter = new SimpleDateFormat("h:mm a", Locale.getDefault());
            remoteView.setTextViewText(R.id.timetableLessonTime, eventDateFormatter.format(eventStart)
                    + " - " + eventDateFormatter.format(eventEnd)
                    + " : " + event.getString("Room"));
        } catch (Exception e) {
            Log.e("widget", e.toString());
        }

        return remoteView;
    }

    @Override
    public int getViewTypeCount()
    {
        // TODO Auto-generated method stub
        return 1;
    }

    @Override
    public boolean hasStableIds()
    {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void onCreate()
    {
        // TODO Auto-generated method stub
        updateWidgetListView();
    }

    @Override
    public void onDataSetChanged()
    {
        // TODO Auto-generated method stub
        updateWidgetListView();
    }

    @Override
    public void onDestroy()
    {
        // TODO Auto-generated method stub
    }
}