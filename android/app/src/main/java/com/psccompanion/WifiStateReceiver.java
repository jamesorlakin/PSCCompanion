package com.psccompanion;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;

public class WifiStateReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        NetworkInfo netInfo = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
        if (netInfo.getState() == NetworkInfo.State.CONNECTED) {
            Intent serviceIntent = new Intent(context, WifiStateService.class);
            serviceIntent.putExtra("wifi", true);
            context.startService(serviceIntent);
            WifiStateService.acquireWakeLockNow(context);
        }
    }
}
