package com.psccompanion;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.util.Log;

import java.util.List;

public class WifiStateReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        WifiManager mWifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        List<ScanResult> networks = mWifiManager.getScanResults();
        showNotification(context, String.valueOf(networks.size()));
        for (ScanResult network : networks) {
            Log.i("wifi", network.toString());
        }
    }

    private void showNotification(Context context, String text) {
        NotificationManager nManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        Notification.Builder nBuilder = new Notification.Builder(context);
        //nBuilder.
        nBuilder.setContentTitle("PSC Companion");
        nBuilder.setSmallIcon(R.mipmap.ic_launcher);
        nBuilder.setContentText(text);
        nManager.notify(1, nBuilder.build());
    }
}
