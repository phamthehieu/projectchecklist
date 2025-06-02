// package com.projectchecklist;

// import android.Manifest;
// import android.annotation.SuppressLint;
// import android.app.Notification;
// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import android.app.PendingIntent;
// import android.app.Service;
// import android.content.BroadcastReceiver;
// import android.content.Context;
// import android.content.Intent;
// import android.content.IntentFilter;
// import android.content.pm.PackageManager;
// import android.location.Location;
// import android.os.BatteryManager;
// import android.os.Build;
// import android.os.Handler;
// import android.os.IBinder;
// import android.os.Looper;
// import android.os.PowerManager;
// import android.util.Log;

// import androidx.annotation.NonNull;
// import androidx.core.app.ActivityCompat;
// import androidx.core.app.NotificationCompat;

// import com.google.android.gms.location.FusedLocationProviderClient;
// import com.google.android.gms.location.LocationAvailability;
// import com.google.android.gms.location.LocationCallback;
// import com.google.android.gms.location.LocationRequest;
// import com.google.android.gms.location.LocationResult;
// import com.google.android.gms.location.LocationServices;

// import org.json.JSONObject;

// import java.io.BufferedReader;
// import java.io.InputStreamReader;
// import java.io.OutputStream;
// import java.net.HttpURLConnection;
// import java.net.URL;
// import java.nio.charset.StandardCharsets;
// import java.text.SimpleDateFormat;
// import java.util.Date;
// import java.util.Locale;
// import java.util.Objects;
// import java.util.Queue;
// import java.util.LinkedList;
// import java.util.UUID;

// public class ForegroundService extends Service {

//     public static final String CHANNEL_ID = "ForegroundServiceChannel";
//     private PowerManager.WakeLock wakeLock;
//     private FusedLocationProviderClient fusedLocationClient;
//     private LocationCallback locationCallback;

//     private String requestId;
//     private String idTaiKhoan;
//     private String idPhuongTien;
//     private String userName;
//     private int phanTramPin;
//     private String authToken;
//     private String refreshToken;
//     private String baseUrl;
//     private BroadcastReceiver batteryReceiver;

//     private Queue<LocationData> locationQueue = new LinkedList<>();
//     private LocationRequest mLocationRequest;

//     // Biến để chống nhảy cóc
//     private Location lastLocation = null;
//     private long lastTimestamp = 0L; // milliseconds

//     @Override
//     public void onCreate() {
//         super.onCreate();
//         fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
//     }

//     @SuppressLint("MissingPermission")
//     private void requestLocationUpdates() {
//         if (ActivityCompat.checkSelfPermission(this,
//                 Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED &&
//                 ActivityCompat.checkSelfPermission(this,
//                         Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//             Log.w("GPSTracking", "Thiếu quyền location");
//             return;
//         }
//         try {
//             mLocationRequest = LocationRequest.create();
//             mLocationRequest.setInterval(5000);
//             mLocationRequest.setFastestInterval(2000);
//             mLocationRequest.setSmallestDisplacement(5f);
//             mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

//             fusedLocationClient.requestLocationUpdates(mLocationRequest, locationCallback, Looper.myLooper());
//         } catch (SecurityException unlikely) {
//             Log.e("GPSTracking", "Lost location permission: " + unlikely);
//         }
//     }

//     @Override
//     public int onStartCommand(Intent intent, int flags, int startId) {
//         if (intent != null) {
//             requestId = intent.getStringExtra("requestId");
//             idTaiKhoan = intent.getStringExtra("idTaiKhoan");
//             idPhuongTien = intent.getStringExtra("idPhuongTien");
//             userName = intent.getStringExtra("userName");
//             phanTramPin = intent.getIntExtra("phanTramPin", -1);
//             authToken = intent.getStringExtra("token");
//             refreshToken = intent.getStringExtra("refreshToken");
//             baseUrl = intent.getStringExtra("baseUrl");
//         }

//         createNotificationChannel();

//         Intent notificationIntent = new Intent(this, MainActivity.class);
//         PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent,
//                 PendingIntent.FLAG_IMMUTABLE);

//         Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
//                 .setContentTitle("Định vị GPS đang chạy")
//                 .setContentText("Ứng dụng đang lấy vị trí...")
//                 .setContentIntent(pendingIntent)
//                 .setOngoing(true)
//                 .build();

//         startForeground(1, notification);

//         // WakeLock: giữ CPU hoạt động tối đa 1 giờ/lần acquire
//         PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
//         wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MyApp::MyWakelockTag");
//         if (!wakeLock.isHeld()) {
//             wakeLock.acquire(60 * 60 * 1000L); // 1 giờ
//         }

//         // Xoá callback cũ nếu có
//         if (fusedLocationClient != null && locationCallback != null) {
//             fusedLocationClient.removeLocationUpdates(locationCallback);
//         }

//         locationCallback = new LocationCallback() {
//             private final Queue<Location> recentLocations = new LinkedList<>();
//             private final int MAX_LOCATIONS_QUEUE = 3;

//             @Override
//             public void onLocationResult(@NonNull LocationResult locationResult) {
//                 Location newLocation = locationResult.getLastLocation();

//                 if (newLocation == null || newLocation.getAccuracy() > 20 || newLocation.getSpeed() > 30) {
//                     Log.d("GPSTracking", "Discarded inaccurate or unrealistic speed location");
//                     return;
//                 }

//                 long now = System.currentTimeMillis();

//                 if (lastLocation != null) {
//                     float distance = newLocation.distanceTo(lastLocation);
//                     long timeDelta = (now - lastTimestamp) / 1000;

//                     if (distance > 300 && timeDelta < 30) {
//                         Log.w("GPSTracking",
//                                 "Discarded jump point: distance=" + distance + "m, time=" + timeDelta + "s");
//                         return;
//                     }
//                 }

//                 recentLocations.offer(newLocation);
//                 if (recentLocations.size() > MAX_LOCATIONS_QUEUE)
//                     recentLocations.poll();

//                 Location filteredLocation = getAverageLocation();

//                 locationQueue.offer(new LocationData(
//                         filteredLocation.getLatitude(),
//                         filteredLocation.getLongitude(),
//                         filteredLocation.getSpeed()));

//                 processLocationQueue();

//                 lastLocation = newLocation;
//                 lastTimestamp = now;
//             }

//             private Location getAverageLocation() {
//                 double latSum = 0, lngSum = 0;

//                 for (Location loc : recentLocations) {
//                     latSum += loc.getLatitude();
//                     lngSum += loc.getLongitude();
//                 }

//                 Location avgLoc = new Location("average");
//                 avgLoc.setLatitude(latSum / recentLocations.size());
//                 avgLoc.setLongitude(lngSum / recentLocations.size());

//                 return avgLoc;
//             }
//         };

//         requestLocationUpdates();
//         registerBatteryChange();

//         return START_STICKY; // Tự động restart nếu bị kill
//     }

//     private void processLocationQueue() {
//         if (!locationQueue.isEmpty()) {
//             LocationData locationData = locationQueue.peek();
//             assert locationData != null;
//             Log.d("GPSTracking", "Gửi vị trí: lat=" + locationData.latitude + ", lng=" + locationData.longitude
//                     + ", speed=" + locationData.tocDo);
//             sendLocationToApi(locationData.latitude, locationData.longitude, locationData.tocDo);
//         }
//     }

//     private void sendLocationToApi(double latitude, double longitude, double tocDo) {
//         new Thread(() -> {
//             try {
//                 URL url = new URL(baseUrl + "/api/gpsapp/ping");
//                 HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//                 urlConnection.setDoOutput(true);
//                 urlConnection.setRequestMethod("POST");
//                 urlConnection.setRequestProperty("Content-Type", "application/json");
//                 urlConnection.setRequestProperty("Authorization", "Bearer " + authToken);
//                 urlConnection.setRequestProperty("x-requestid", requestId);

//                 String time = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(new Date());
//                 @SuppressLint("DefaultLocale")
//                 String jsonInputString = String.format(
//                         "{\"RequestId\": \"%s\", \"ID_TaiKhoan\": \"%s\", \"ID_PhuongTien\": \"%s\", \"KinhDo\": \"%s\", \"ViDo\": \"%s\", \"TocDo\": \"%s\", \"SaiSo\": %d, \"PhanTramPin\": %d, \"ThoiGian\": \"%s\", \"Created_By\": \"%s\"}",
//                         requestId, idTaiKhoan, idPhuongTien, longitude, latitude, tocDo, -1, phanTramPin, time,
//                         userName);

//                 try (OutputStream os = urlConnection.getOutputStream()) {
//                     byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
//                     os.write(input, 0, input.length);
//                 }

//                 int code = urlConnection.getResponseCode();
//                 Log.d("GPSTracking", String.valueOf(url));
//                 Log.d("GPSTracking", String.valueOf(jsonInputString));
//                 if (code == 200) {
//                     Log.d("GPSTracking", "Location sent successfully");
//                     locationQueue.poll();
//                 } else if (code == 401) {
//                     Log.d("GPSTracking", "Token expired, refreshing...");
//                     refreshAuthToken();
//                 } else {
//                     Log.e("GPSTracking", "Failed to send location, code: " + code);
//                 }
//             } catch (Exception e) {
//                 Log.e("GPSTracking", "Exception in sending location", e);
//             }
//         }).start();
//     }

//     private static class LocationData {
//         double latitude;
//         double longitude;
//         double tocDo;

//         LocationData(double latitude, double longitude, double tocDo) {
//             this.latitude = latitude;
//             this.longitude = longitude;
//             this.tocDo = tocDo;
//         }
//     }

//     private void registerBatteryChange() {
//         IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
//         batteryReceiver = new BroadcastReceiver() {
//             @Override
//             public void onReceive(Context context, Intent intent) {
//                 try {
//                     int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
//                     int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
//                     float batteryPct = level / (float) scale * 100;
//                     Log.d("GPSTracking", "Current battery level: " + batteryPct + "%");
//                     phanTramPin = (int) batteryPct;
//                 } catch (Exception ex) {
//                     Log.d("GPSTracking", Objects.requireNonNull(ex.getMessage()));
//                 }
//             }
//         };
//         getApplicationContext().registerReceiver(batteryReceiver, ifilter);
//     }

//     private void removeBatteryListener() {
//         if (batteryReceiver != null)
//             getApplicationContext().unregisterReceiver(batteryReceiver);
//     }

//     private void refreshAuthToken() {
//         new Thread(() -> {
//             int retryAttempts = 3;
//             while (retryAttempts > 0) {
//                 try {
//                     String requestIdRefresh = UUID.randomUUID().toString();
//                     URL url = new URL(baseUrl + "/api/login/refresh-token-app");
//                     HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
//                     urlConnection.setRequestMethod("POST");
//                     urlConnection.setRequestProperty("Content-Type", "application/json");
//                     urlConnection.setRequestProperty("x-requestid", requestIdRefresh);
//                     urlConnection.setDoOutput(true);
//                     String jsonInputString = String.format(
//                             "{\"RequestId\":\"%s\", \"UserName\": \"%s\", \"RefreshToken\": \"%s\"}",
//                             requestIdRefresh, userName, refreshToken);

//                     try (OutputStream os = urlConnection.getOutputStream()) {
//                         byte[] input = jsonInputString.getBytes(StandardCharsets.UTF_8);
//                         os.write(input, 0, input.length);
//                     }

//                     int code = urlConnection.getResponseCode();
//                     if (code == 200) {
//                         try (BufferedReader reader = new BufferedReader(
//                                 new InputStreamReader(urlConnection.getInputStream(), StandardCharsets.UTF_8))) {
//                             StringBuilder response = new StringBuilder();
//                             String line;
//                             while ((line = reader.readLine()) != null) {
//                                 response.append(line);
//                             }

//                             JSONObject jsonResponse = new JSONObject(response.toString());
//                             Log.d("GPSTracking", jsonResponse.toString());
//                             JSONObject valueObject = jsonResponse.optJSONObject("Value");
//                             if (valueObject != null) {
//                                 authToken = valueObject.optString("AccessToken", authToken);
//                                 refreshToken = valueObject.optString("RefreshToken", refreshToken);
//                             }
//                         }
//                         break;
//                     } else {
//                         Log.e("TokenRefresh123", "Failed to refresh token, code: " + code);
//                     }
//                 } catch (Exception e) {
//                     Log.e("TokenRefresh123", "Exception during token refresh", e);
//                 }

//                 retryAttempts--;
//                 if (retryAttempts > 0) {
//                     try {
//                         Thread.sleep(2000);
//                     } catch (InterruptedException ie) {
//                         Thread.currentThread().interrupt();
//                     }
//                 } else {
//                     Log.e("TokenRefresh123", "Exhausted all retry attempts");
//                 }
//             }
//         }).start();
//     }

//     @Override
//     public void onDestroy() {
//         super.onDestroy();
//         NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//         if (notificationManager != null) {
//             notificationManager.cancelAll();
//         }
//         if (wakeLock != null && wakeLock.isHeld()) {
//             wakeLock.release();
//         }
//         if (fusedLocationClient != null && locationCallback != null) {
//             fusedLocationClient.removeLocationUpdates(locationCallback);
//         }
//         removeBatteryListener();
//     }

//     private void createNotificationChannel() {
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             NotificationChannel serviceChannel = new NotificationChannel(
//                     CHANNEL_ID,
//                     "Foreground Service Channel",
//                     NotificationManager.IMPORTANCE_HIGH);
//             NotificationManager manager = getSystemService(NotificationManager.class);
//             if (manager != null) {
//                 manager.createNotificationChannel(serviceChannel);
//             }
//         }
//     }

//     @Override
//     public void onTaskRemoved(Intent rootIntent) {
//         super.onTaskRemoved(rootIntent);
//         stopSelf();
//     }

//     @Override
//     public IBinder onBind(Intent intent) {
//         return null;
//     }
// }
package com.projectchecklist;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ForegroundService extends Service {

    private static final String CHANNEL_ID = "ForegroundServiceChannel";
    private PowerManager.WakeLock wakeLock;
    private FusedLocationProviderClient fusedLocationClient;
    private LocationCallback locationCallback;

    private String requestId, idTaiKhoan, idPhuongTien, userName, authToken, refreshToken, baseUrl;
    private int phanTramPin;

    private ScheduledExecutorService scheduler;
    private Location latestLocation;

    @Override
    public void onCreate() {
        super.onCreate();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
    }

    @SuppressLint("MissingPermission")
    private void requestLocationUpdates() {
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            Log.w("GPSTracking", "Thiếu quyền location");
            return;
        }

        LocationRequest locationRequest = LocationRequest.create()
                .setInterval(5000)
                .setFastestInterval(2000)
                .setSmallestDisplacement(5f)
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.myLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        requestId = intent.getStringExtra("requestId");
        idTaiKhoan = intent.getStringExtra("idTaiKhoan");
        idPhuongTien = intent.getStringExtra("idPhuongTien");
        userName = intent.getStringExtra("userName");
        phanTramPin = intent.getIntExtra("phanTramPin", -1);
        authToken = intent.getStringExtra("token");
        refreshToken = intent.getStringExtra("refreshToken");
        baseUrl = intent.getStringExtra("baseUrl");

        createNotificationChannel();

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(@NonNull LocationResult locationResult) {
                Location loc = locationResult.getLastLocation();
                if (loc != null && loc.getAccuracy() <= 20 && loc.getSpeed() <= 30) {
                    latestLocation = loc;
                    updateNotificationWithLocation(loc);
                }
            }
        };

        requestLocationUpdates();

        scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            if (latestLocation != null) {
                sendLocationToApi(latestLocation);
            }
        }, 0, 10, TimeUnit.SECONDS);

        return START_STICKY;
    }

    private void updateNotificationWithLocation(Location location) {
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Định vị GPS đang chạy")
                .setContentText("Lat: " + location.getLatitude() + ", Lng: " + location.getLongitude())
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)
                .setOngoing(true)
                .build();

        startForeground(1, notification);
    }

    private void sendLocationToApi(Location location) {
        new Thread(() -> {
            try {
                URL url = new URL(baseUrl + "/api/gpsapp/ping");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setDoOutput(true);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Authorization", "Bearer " + authToken);

                String time = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault()).format(new Date());

                String payload = new JSONObject()
                        .put("RequestId", requestId)
                        .put("ID_TaiKhoan", idTaiKhoan)
                        .put("ID_PhuongTien", idPhuongTien)
                        .put("KinhDo", location.getLongitude())
                        .put("ViDo", location.getLatitude())
                        .put("TocDo", location.getSpeed())
                        .put("SaiSo", -1)
                        .put("PhanTramPin", phanTramPin)
                        .put("ThoiGian", time)
                        .put("Created_By", userName).toString();

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.getBytes(StandardCharsets.UTF_8));
                }

                int code = conn.getResponseCode();
                if (code == 401)
                    refreshAuthToken();

            } catch (Exception e) {
                Log.e("GPSTracking", "Exception: " + e);
            }
        }).start();
    }

    private void refreshAuthToken() {
        new Thread(() -> {
            try {
                String requestIdRefresh = java.util.UUID.randomUUID().toString();
                URL url = new URL(baseUrl + "/api/login/refresh-token-app");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("x-requestid", requestIdRefresh);
                conn.setDoOutput(true);

                String payload = new JSONObject()
                        .put("RequestId", requestIdRefresh)
                        .put("UserName", userName)
                        .put("RefreshToken", refreshToken)
                        .toString();

                try (OutputStream os = conn.getOutputStream()) {
                    os.write(payload.getBytes(StandardCharsets.UTF_8));
                }

                int code = conn.getResponseCode();
                if (code == 200) {
                    java.io.BufferedReader reader = new java.io.BufferedReader(
                            new java.io.InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    JSONObject jsonResponse = new JSONObject(response.toString());
                    JSONObject valueObject = jsonResponse.optJSONObject("Value");
                    if (valueObject != null) {
                        authToken = valueObject.optString("AccessToken", authToken);
                        refreshToken = valueObject.optString("RefreshToken", refreshToken);
                    }
                } else {
                    Log.e("TokenRefresh", "Failed to refresh token, code: " + code);
                }
            } catch (Exception e) {
                Log.e("TokenRefresh", "Exception during token refresh", e);
            }
        }).start();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        scheduler.shutdown();
        fusedLocationClient.removeLocationUpdates(locationCallback);
        if (wakeLock.isHeld())
            wakeLock.release();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "GPS Service",
                    NotificationManager.IMPORTANCE_HIGH);
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }
}
