/**
 * Created by lenovo on 2017/11/22.
 */

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
//当前设备为Android
if(_browser.android){
    $(".android_download").css("display","block").siblings(".ios_download").css("display","none");
    $(".android_download").click(function(){
        $(this).children().attr("src","images/button_down.png");
    });
}else if(_browser.iPhone||_browser.iPad){
   $(".ios_download").css("display","block").siblings(".android_download").css("display","none");
    $(".ios_download").click(function(){
        $(this).children().attr("src","images/iosbutton_down.png");
    });
}
$(".share-head .code-container").click(function(){
    $(this).children().attr("src","images/_down.png");
    //$(this).next(".wechat-img").toggleClass("active");
    $(this).next(".wechat-img").fadeToggle("slow", "linear");
});