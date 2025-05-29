package com.gpsbackgroundservice

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Build
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.google.android.gms.location.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.math.roundToInt

@ReactModule(name = GpsBackgroundServiceModule.NAME)
class GpsBackgroundServiceModule(reactContext: ReactApplicationContext) : NativeGpsBackgroundServiceSpec(reactContext) {

    private var fusedLocationClient: FusedLocationProviderClient? = null
    private var locationCallback: LocationCallback? = null
    private var isServiceRunning = false
    private val CHANNEL_ID = "gps_background_service"
    private val NOTIFICATION_ID = 1
    private var notificationManager: NotificationManager? = null
    private var lastLocation: Location? = null
    private var lastUpdateTime: Long = 0
    private var wakeLock: PowerManager.WakeLock? = null

    override fun getName(): String {
        return NAME
    }

    override fun startLocationUpdates(promise: Promise) {
        if (isServiceRunning) {
            promise.resolve(null)
            return
        }

        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Location permission not granted")
            return
        }

        // Acquire wake lock
        acquireWakeLock()

        createNotificationChannel()
        startForegroundService()

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(reactApplicationContext)
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    // Tính toán tốc độ
                    val speed = calculateSpeed(location)
                    
                    // Cập nhật vị trí cuối
                    lastLocation = location
                    lastUpdateTime = System.currentTimeMillis()

                    // Gửi sự kiện với thông tin vị trí và tốc độ
                    val locationMap = createLocationMap(location)
                    locationMap.putDouble("speed", speed)
                    sendEvent("onLocationUpdate", locationMap)

                    // Cập nhật notification
                    updateNotification(location, speed)
                }
            }
        }

        val locationRequest = LocationRequest.create().apply {
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
            interval = 5000 // 5 seconds
            fastestInterval = 3000 // 3 seconds
            maxWaitTime = 10000 // 10 seconds
        }

        fusedLocationClient?.requestLocationUpdates(
            locationRequest,
            locationCallback!!,
            Looper.getMainLooper()
        )

        isServiceRunning = true
        promise.resolve(null)
    }

    override fun stopLocationUpdates(promise: Promise) {
        if (!isServiceRunning) {
            promise.resolve(null)
            return
        }

        fusedLocationClient?.removeLocationUpdates(locationCallback!!)
        stopForegroundService()
        releaseWakeLock()
        isServiceRunning = false
        promise.resolve(null)
    }

    override fun isLocationUpdatesRunning(promise: Promise) {
        promise.resolve(isServiceRunning)
    }

    override fun getLastLocation(promise: Promise) {
        if (ActivityCompat.checkSelfPermission(reactApplicationContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            promise.reject("PERMISSION_DENIED", "Location permission not granted")
            return
        }

        fusedLocationClient?.lastLocation?.addOnSuccessListener { location ->
            if (location != null) {
                promise.resolve(createLocationMap(location))
            } else {
                promise.resolve(null)
            }
        }?.addOnFailureListener { e ->
            promise.reject("ERROR", e.message)
        }
    }

    override fun addListener(eventName: String) {
        // Required for RN built in Event Emitter
    }

    override fun removeListeners(count: Double) {
        // Required for RN built in Event Emitter
    }

    private fun createLocationMap(location: Location): WritableMap {
        return Arguments.createMap().apply {
            putDouble("latitude", location.latitude)
            putDouble("longitude", location.longitude)
            putDouble("accuracy", location.accuracy.toDouble())
            putDouble("timestamp", location.time.toDouble())
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "GPS Background Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Thông báo khi ứng dụng đang theo dõi vị trí ở chế độ nền"
                setShowBadge(false)
                enableLights(false)
                enableVibration(false)
            }
            notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager?.createNotificationChannel(channel)
        }
    }

    private fun startForegroundService() {
        val notificationIntent = Intent(reactApplicationContext, reactApplicationContext.packageManager.getLaunchIntentForPackage(reactApplicationContext.packageName)?.component?.className?.let { Class.forName(it) })
        val pendingIntent = PendingIntent.getActivity(
            reactApplicationContext,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
            .setContentTitle("Đang theo dõi vị trí")
            .setContentText("Đang lấy vị trí...")
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()

        val serviceIntent = Intent(reactApplicationContext, GpsBackgroundService::class.java)
        serviceIntent.putExtra("notification", notification)
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(serviceIntent)
        } else {
            reactApplicationContext.startService(serviceIntent)
        }
    }

    private fun stopForegroundService() {
        reactApplicationContext.stopService(Intent(reactApplicationContext, GpsBackgroundService::class.java))
    }

    private fun updateNotification(location: Location, speed: Double) {
        val notificationIntent = Intent(reactApplicationContext, reactApplicationContext.packageManager.getLaunchIntentForPackage(reactApplicationContext.packageName)?.component?.className?.let { Class.forName(it) })
        val pendingIntent = PendingIntent.getActivity(
            reactApplicationContext,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        val speedText = if (speed > 0) {
            "Tốc độ: %.1f km/h".format(speed)
        } else {
            "Đang đứng yên"
        }

        val notification = NotificationCompat.Builder(reactApplicationContext, CHANNEL_ID)
            .setContentTitle("Đang theo dõi vị trí")
            .setContentText(speedText)
            .setStyle(NotificationCompat.BigTextStyle()
                .bigText("""
                    $speedText
                    Vĩ độ: %.6f
                    Kinh độ: %.6f
                    Độ chính xác: %.2fm
                """.trimIndent().format(
                    location.latitude,
                    location.longitude,
                    location.accuracy
                )))
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()

        notificationManager?.notify(NOTIFICATION_ID, notification)
    }

    private fun calculateSpeed(currentLocation: Location): Double {
        if (lastLocation == null || lastUpdateTime == 0L) {
            return 0.0
        }

        val distance = currentLocation.distanceTo(lastLocation!!)
        val timeDiff = (System.currentTimeMillis() - lastUpdateTime) / 1000.0 // Convert to seconds
        
        return if (timeDiff > 0.0) {
            // Convert m/s to km/h
            (distance / timeDiff) * 3.6
        } else {
            0.0
        }
    }

    private fun acquireWakeLock() {
        val powerManager = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "GpsBackgroundService::WakeLock"
        ).apply {
            acquire(10*60*1000L /*10 minutes*/)
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let {
            if (it.isHeld) {
                it.release()
            }
        }
        wakeLock = null
    }

    companion object {
        const val NAME = "GpsBackgroundService"
    }
}

class GpsBackgroundService : Service() {
    private val NOTIFICATION_ID = 1
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onCreate() {
        super.onCreate()
        acquireWakeLock()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = intent?.getParcelableExtra<android.app.Notification>("notification")
        if (notification != null) {
            startForeground(NOTIFICATION_ID, notification)
        }
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        releaseWakeLock()
        // Khởi động lại service nếu bị kill
        val intent = Intent(applicationContext, GpsBackgroundService::class.java)
        startService(intent)
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        // Khởi động lại service khi app bị kill
        val intent = Intent(applicationContext, GpsBackgroundService::class.java)
        startService(intent)
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun acquireWakeLock() {
        val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "GpsBackgroundService::WakeLock"
        ).apply {
            acquire(10*60*1000L /*10 minutes*/)
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let {
            if (it.isHeld) {
                it.release()
            }
        }
        wakeLock = null
    }
}
