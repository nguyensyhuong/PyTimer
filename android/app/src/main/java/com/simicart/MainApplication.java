package com.simicart;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.crashlytics.android.core.CrashlyticsCore;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.smixx.fabric.FabricPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.oblador.vectoricons.VectorIconsPackage;
import com.simicart.wraper.NativeMethodPackage;
import com.wenkesj.voice.VoicePackage;


import java.util.Arrays;
import java.util.List;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.kevinejohn.RNMixpanel.*;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new ImagePickerPackage(),
                    new FabricPackage(),
                    new RNCameraPackage(),
                    new VoicePackage(),
                    new ReactNativeYouTube(),
                    new ReactVideoPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseNotificationsPackage(),
                    new ReactNativeRestartPackage(),
                    new VectorIconsPackage(),
                    new NativeMethodPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new MapsPackage(),
                    new RNMixpanel(),
                    new RNFirebaseAnalyticsPackage(),
                    new RNFirebaseLinksPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Crashlytics crashlyticsKit = new Crashlytics.Builder()
                .core(new CrashlyticsCore.Builder().disabled(com.crashlytics.android.BuildConfig.DEBUG).build())
                .build();
        Fabric.with(this, crashlyticsKit);
        FacebookSdk.sdkInitialize(this);
        SoLoader.init(this, /* native exopackage */ false);
    }

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }
}
