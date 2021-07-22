package com.rnnewrelic;

import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.newrelic.agent.android.NewRelic;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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
        return "NewRelicModule";
    }
    Exception e = new Exception();


    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void nrInit(String FirstScreen) {
        timerDate = new Date();
        LastScreen = FirstScreen;
    }

    @ReactMethod
    public void addUserId(String userId) {
        Map localMap = new HashMap<>();
        localMap.put("UserId", userId);
        NewRelic.recordCustomEvent("RnUserId", localMap);
    }

    @ReactMethod
    public void recordMetric(String inEventType, String inJson) {
        JSONObject mainObject;
        String jsonName = "";
        String sometext;
        Map attributes = new HashMap();
        Double testnum = 1.0;
        boolean numeric = false;

        try {
            mainObject = new JSONObject(inJson);
            int recLength = mainObject.length();
            if (recLength > 0) {

                JSONArray jsonArray = mainObject.names();
                for (int i = 0; i < mainObject.length(); i++) {

                    jsonName = jsonArray.getString(i);
                    sometext = mainObject.getString(jsonName);

                    try {
                        testnum = Double.parseDouble(sometext);
                    } catch (NumberFormatException e) {
                        numeric = false;
                    }

                    if (numeric) {
                        attributes.put(jsonName, testnum);
                    } else if (sometext.equalsIgnoreCase("true")) {
                        attributes.put(jsonName, "true");
                    } else if (sometext.equalsIgnoreCase("false")) {
                        attributes.put(jsonName, "false");
                    } else {
                        attributes.put(jsonName, sometext);
                    }
                }

            }
            NewRelic.recordCustomEvent(inEventType, attributes);
        } catch (JSONException e) {
            e.printStackTrace();

            NewRelic.recordHandledException(e);
        }
    }
    @ReactMethod
    public void nrRecordMetricNumber(String name, String catagory,double inValue){
        NewRelic.recordMetric("Custom Metric Name","MyCategory", 1.0);
        NewRelic.recordMetric(name,catagory,inValue);
        Log.i("newrelic", String.valueOf(inValue));
    }
    @ReactMethod
    public void applicationVersion(String appversion){
        //NewRelic.withApplicationVersion(appversion);
    }

    @ReactMethod
    public void interaction(String screen) {
        Date now = new Date();
        long elapsedtime = now.getTime() - timerDate.getTime();

        Map attributes = new HashMap();
        attributes.put("Screen", screen);
        attributes.put("duration", elapsedtime);
        NewRelic.recordCustomEvent("RNInteraction", attributes);
    }

    @ReactMethod
    public void logSend(String loglevel, String message, String stack, String lineNumber, String fileName, String columnNumber, String name) {
        Map localMap = new HashMap<>();

        if (stack != null && stack.length() > 0) {
            localMap.put("stack", stack);
        } else {
            localMap.put("stack", "No Trace");
        }

        if (name != null && name.length() > 0) {
            localMap.put("name", name);
        } else {
            localMap.put("name", "No Name");
        }

        if (message != null && message.length() > 0) {
            localMap.put("message", message);
        } else {
            localMap.put("message", "No Message");
        }

        localMap.put("logLevel", loglevel);
        localMap.put("platform", "android");
        NewRelic.recordCustomEvent("RNError", localMap);
    }

}
