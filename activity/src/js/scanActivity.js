$(function () {
    var webUrl = 'https://api.wdb007.com/wdb-wxapp-api-test/';
    var Request = new Object();
    Request = GetRequest();
    var qrStr = Request['qr'];
    $("#send_code_btn").click(function () {
        getCode();
    });

    // // 获取验证码  
    function getCode() {
        var userPhone = $("#user_phone").val();
        if (isMobile(userPhone)) {
            var url = webUrl + '/user/getRegisterCode?mobile_no=' + userPhone;
            $.when(get(url)).done(function (data) {
                resetCode(); //倒计时
                console.log(JSON.stringify(data));
            }).catch(function (err) {
                $('.err_info').html(JSON.stringify(err));
            });
        } else {
            $('.err_info').html('请填写正确的手机号码');
        }
    }

    // //倒计时
    function resetCode() {
        $('#send_code_btn').hide();
        $('#J_second').html('60');
        $('#J_resetCode').show();
        var second = 60;
        var timer = null;
        timer = setInterval(function () {
            second -= 1;
            if (second > 0) {
                $('#J_second').html(second);
            } else {
                clearInterval(timer);
                $('#send_code_btn').show();
                $('#J_resetCode').hide();
            }
        }, 1000);
    }

    //    点击领取月卡
    $("#check_btn").click(function () {
        var code = $("#user_code").val();
        var userPhone = $("#user_phone").val();
        console.log(code,userPhone);
        var postData = {
            mobile: userPhone,
            verify_code: code,
            scanCode:qrStr
        };
        var url = 'https://api.wdb007.com/wdb-wxapp-test/scan/scanActivityByPhone';
        $.ajax({
            type:'POST',
            data:postData,
            url:url,
            success:function(res){
                console.log(res);
                if(res.code == 0){
                    location.href = "html/scanActiSucc.html?code=0";
                }else if(res.code == 10001){
                    location.href = "html/scanActiSucc.html?code=1";
                }else if(res.code == 1010070017){
                    location.href = "html/scanActiSucc.html?code=2";
                }else if(res.code == 10002){
                    alert(res.message);
                }else{
                    alert(res.message)
                }
                
            },
            error:function(err){
                console.log('err',err);
            }
        });
    });
    // 点击领取优惠券
    $('#get_btn').click(function(){
        
    });
});