package vn.linhdao.hopkich;
import android.app.Activity;
import android.os.Bundle;
import android.content.pm.ActivityInfo;
import android.view.View;
import android.webkit.*;
import android.net.Uri;
import java.io.*;

public class MainActivity extends Activity {
 private WebView web;
 private boolean landscape=false;
 private static final String HOST="appassets.androidplatform.net";
 private void immersive(){getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN|View.SYSTEM_UI_FLAG_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY|View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN|View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION|View.SYSTEM_UI_FLAG_LAYOUT_STABLE);}
 @Override public void onCreate(Bundle state){super.onCreate(state);immersive();web=new WebView(this);web.setBackgroundColor(0xff090e17);setContentView(web);
 WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);settings.setMediaPlaybackRequiresUserGesture(true);
 web.setWebViewClient(new WebViewClient(){
 @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){Uri u=request.getUrl();String path=u.getPath();if("https".equals(u.getScheme())&&HOST.equals(u.getHost())&&path!=null&&path.startsWith("/assets/")&&!path.contains("..")){
 String name=path.substring(8);String mime=name.endsWith(".html")?"text/html":name.endsWith(".css")?"text/css":name.endsWith(".js")?"application/javascript":name.endsWith(".webp")?"image/webp":name.endsWith(".png")?"image/png":name.endsWith(".svg")?"image/svg+xml":"application/octet-stream";
 try{return new WebResourceResponse(mime,"UTF-8",getAssets().open("game/"+name));}catch(IOException e){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",null,new ByteArrayInputStream(new byte[0]));}}
 return new WebResourceResponse("text/plain","UTF-8",403,"Blocked",null,new ByteArrayInputStream(new byte[0]));}
 @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){return !HOST.equals(request.getUrl().getHost());}
 });web.addJavascriptInterface(new Object(){@JavascriptInterface public void toggleLandscape(){runOnUiThread(new Runnable(){public void run(){landscape=!landscape;setRequestedOrientation(landscape?ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE:ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);immersive();}});}},"AndroidHost");
 if(state==null||web.restoreState(state)==null)web.loadUrl("https://"+HOST+"/assets/index.html");}
 @Override public void onWindowFocusChanged(boolean focused){super.onWindowFocusChanged(focused);if(focused)immersive();}
 @Override protected void onSaveInstanceState(Bundle out){web.saveState(out);super.onSaveInstanceState(out);}
 @Override protected void onPause(){web.onPause();super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
 @Override public void onBackPressed(){web.evaluateJavascript("(function(){var o=document.getElementById('overlay');if(o&&!o.classList.contains('hidden')){closeModal();return true;}return false;})()",new ValueCallback<String>(){public void onReceiveValue(String value){if(!"true".equals(value))MainActivity.super.onBackPressed();}});}
 @Override protected void onDestroy(){web.destroy();super.onDestroy();}
}
