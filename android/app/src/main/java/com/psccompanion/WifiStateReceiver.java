package com.psccompanion;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.util.Log;

import java.util.List;

public class WifiStateReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        WifiManager mWifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        List<ScanResult> networks = mWifiManager.getScanResults();

        String extraText = "";
        for (ScanResult network : networks) {
            extraText = extraText + network.SSID + " (" + network.BSSID + ")\n";
        }
        showNotification(context, String.valueOf(networks.size()), extraText);
    }

    private void showNotification(Context context, String text, String extraText) {
        NotificationManager nManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        Notification.Builder nBuilder = new Notification.Builder(context);
        if (extraText != null) {
            Notification.BigTextStyle nBigText = new Notification.BigTextStyle();
            nBigText.bigText(extraText);
            nBuilder.setStyle(nBigText);
        }
        nBuilder.setContentTitle("PSC Companion");
        nBuilder.setSmallIcon(R.mipmap.ic_launcher);
        nBuilder.setContentText(text);
        nManager.notify(1, nBuilder.build());
    }
}
