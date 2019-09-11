package com.rnnewrelic;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.newrelic.agent.android.NewRelic;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

public class NewRelicModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    private Date timerDate = new Date();
    private String LastScreen = "null";

    public NewRelicModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NewRelicAgentRN";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void addUserId(String userId){
        Map localMap = new HashMap<>();
        localMap.put("UserId", userId);
        NewRelic.recordCustomEvent("RnUserId", localMap);


    }
    @ReactMethod
    public void nrInit(String FirstScreen){
        timerDate = new Date();
        LastScreen = FirstScreen;
    }

    @ReactMethod
    public void interaction(String screen){
        Date now = new Date();
        long elapsedtime = now.getTime() - timerDate.getTime();

        Map attributes = new HashMap();
        attributes.put("Screen", screen);
        attributes.put("duration",elapsedtime);
        NewRelic.recordCustomEvent("RNInteraction", attributes);
    }

    @ReactMethod
    public void logSend(String loglevel, String message,String stack,String lineNumber, String fileName, String columnNumber, String name) {
        Map localMap = new HashMap<>();
        if (stack.length() > 0) {
            localMap.put("stack", stack);
        } else {
            localMap.put("stack", "No Trace");
        }
        if (name.length() > 0) {
            localMap.put("name", name);
        } else {
            localMap.put("name", "No Name");
        }
        if (message.length() > 0) {
            localMap.put("message", message);
        } else {
            localMap.put("message", "No Message");
        }
        localMap.put("logLevel", loglevel);
        NewRelic.recordCustomEvent("RNError", localMap);
    }


}
