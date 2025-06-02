package com.projectchecklist;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ForegroundServiceModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    ForegroundServiceModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ForegroundService";
    }

    @ReactMethod
    public void startService(String requestId, String idTaiKhoan, String idPhuongTien, String userName, int phanTramPin,
            String thoiGian, String token, String refreshToken, String baseUrl) {
        Intent serviceIntent = new Intent(reactContext, ForegroundService.class);
        serviceIntent.putExtra("requestId", requestId);
        serviceIntent.putExtra("idTaiKhoan", idTaiKhoan);
        serviceIntent.putExtra("idPhuongTien", idPhuongTien);
        serviceIntent.putExtra("userName", userName);
        serviceIntent.putExtra("phanTramPin", phanTramPin);
        serviceIntent.putExtra("thoiGian", thoiGian);
        serviceIntent.putExtra("token", token);
        serviceIntent.putExtra("refreshToken", refreshToken);
        serviceIntent.putExtra("baseUrl", baseUrl);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
    }

    private boolean checkPermission() {
        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat
                .from(reactContext.getApplicationContext());
        boolean areNotificationsEnabled = notificationManagerCompat.areNotificationsEnabled();
        Log.i("CheckNotify:", areNotificationsEnabled + "");
        return areNotificationsEnabled;
    }

    private void openNotificationSettings() {
        if (!checkPermission()) {
            String package_name = reactContext.getPackageName();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_APP_PACKAGE, package_name);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra("app_package", package_name);
                intent.putExtra("app_uid", reactContext.getApplicationInfo().uid);
                reactContext.startActivity(intent);
            } else {
                Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                intent.setData(Uri.parse("package:" + package_name));
                reactContext.startActivity(intent);
            }
        }
    }

    @ReactMethod
    public void stopService() {
        Intent serviceIntent = new Intent(reactContext, ForegroundService.class);
        reactContext.stopService(serviceIntent);
    }
}
