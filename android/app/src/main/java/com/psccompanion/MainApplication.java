package com.psccompanion;

import android.app.Application;

import com.facebook.react.ReactApplication;
import in.sriraman.sharedpreferences.RNSharedPreferencesReactPackage;

import com.flurry.android.FlurryAgent;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharedPreferencesReactPackage(),
            new RNAdMobPackage(),
            new PhotoViewPackage(),
            new JSNotificationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (!BuildConfig.DEBUG) new FlurryAgent.Builder()
      .withLogEnabled(true)
      .build(this, "BJBCXVH7VSCMWGHZ3F55");
  }
}
