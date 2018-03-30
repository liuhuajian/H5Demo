/**
 * Created by lenovo on 2017/11/16.
 */
$(document).ready(function () {
    var localIds = '';
    //通过ajax，在页面加载的时候获取微信分享接口signature，nonceStr，timestamp 和appId
    $.ajax({
        type: "post",
        url: "https://api.wdb007.com/manager-web/wx/share",
        dataType: "json",
        data:"url="+window.location.href.split('#').toString(),
        success: function (data) {
            console.log(data);
            wx.config({
                debug: false,
                appId: data.app_id,
                timestamp: data.timestamp,
                nonceStr: data.nonce_str,
                signature: data.signature,
                jsApiList: ['scanQRCode']
                // 功能列表，我们要使用JS-SDK的什么功能
            });
            wx.ready(function () {
                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.scanQRCode({

                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，

                    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有

                    success: function (res) {

                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        console.log(res);

                    }

                });
            });
            wx.error(function (res) {
                console.log(res);
                //alert(res);
                //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
            });
        }
    })
});