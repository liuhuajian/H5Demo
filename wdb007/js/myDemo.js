/**
 * Created by lenovo on 2017/8/22.
 */
console.log(navigator.userAgent);
//生成二维码
$(".demo-mmqrcode").qrcode("http://192.168.0.31/ydui/myDemo.html");
function GetMobelType() {
    var browser = {
        versions: function() {
            var u = window.navigator.userAgent;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                Alipay: u.indexOf('Alipay') > -1, //支付宝
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
                iPad: u.indexOf('iPad') > -1, //是否为iPad
                webApp: u.indexOf('Safari') == -1, //是否为web应用程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否为微信浏览器
                Safari: u.indexOf('Safari') > -1 //Safari浏览器
            };
        }()
    };
    return browser.versions;
}
var _browser=GetMobelType();
console.log("_browser.iPhone:"+_browser.iPhone,"_browser.android:"+_browser.android,"_browser.trident:"+_browser.trident,"_browser.iPad:"+_browser.iPad);
//当前设备为Android，点击IOS下载按钮时的操作
var dialog = window.YDUI.dialog;
if(_browser.android){
    $("#android_Alert").click(function(){
        location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.antourong.itouzi";
    });
    $("#ios_Alert").click(function(){
        dialog.alert("温馨提示：请下载android版本");
    });
}else if(_browser.iPhone||_browser.iPad){
    $("#ios_Alert").click(function(){
        location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.antourong.itouzi";
    });
    $("#android_Alert").click(function(){
        dialog.alert("温馨提示：请下载iphone版本");
    });
}else{
    $("#android_Alert").click(function(){
        location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.antourong.itouzi";
    });
    $("#ios_Alert").click(function(){
        location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.antourong.itouzi";
    });
}
