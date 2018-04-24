package com.psccompanion;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class JSNotificationModule extends ReactContextBaseJavaModule {

    Context mContext;

    public JSNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @ReactMethod
    public void addNotification(String title, String message) {
        NotificationManager nManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);

        Notification.Builder nBuilder = new Notification.Builder(mContext);
        nBuilder.setContentTitle(title);
        nBuilder.setContentText(message);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            nBuilder.setShowWhen(false);
        }
        nBuilder.setSmallIcon(R.drawable.notification_icon);
        nBuilder.setStyle(new Notification.BigTextStyle().bigText(message));
        nBuilder.setContentIntent(PendingIntent.getActivity(mContext, 0, new Intent(mContext, MainActivity.class), PendingIntent.FLAG_UPDATE_CURRENT));

        nManager.notify(message.hashCode(), nBuilder.build());
    }

    @Override
    public String getName() {
        return "JSNotification";
    }
}