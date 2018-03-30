/**
 * Created by lenovo on 2017/10/28.
 */
!$(function(win,$) {
    var dialog = win.YDUI.dialog;
    var isPhone = 1;
    $("#J_getCode").click(function(){
        getCode();
    });
    function getCode() {
        checkPhone(); //验证手机号码
        if (isPhone==1) {
            resetCode(); //倒计时
            var user_phone=$("#phone").val();
            $.ajax({
                type:"GET",
                url:"http://192.168.0.12/wdb007/user/getRegisterCode?mobile_no="+user_phone,
                success:function(res){
                    dialog.toast(res.message, 30);
                }
            });
        } else {
            $('#phone').focus();
        }
    }
//验证手机号码
    function checkPhone() {
        var phone = $('#phone').val();
        var pattern = /^1[0-9]{10}$/;
        isPhone = 1;
        if (phone == '') {
            dialog.toast('请输入手机号码', 30);
            isPhone = 0;
            return;
        }
        if (!pattern.test(phone)) {
            dialog.toast('请输入正确的手机号码', 30);
            isPhone = 0;
            return;
        }
    }
//倒计时
    function resetCode() {
            $('#J_getCode').hide();
            $('#J_second').html('60');
            $('#J_resetCode').show();
            var second = 60;
            var timer = null;
            timer = setInterval(function() {
                second -= 1;
                if (second > 0) {
                    $('#J_second').html(second);
                } else {
                    clearInterval(timer);
                    $('#J_getCode').show();
                    $('#J_resetCode').hide();
                }
            }, 1000);
    }
//    登陆
$("#check_btn").click(function(){
    var code=$("#code").val();
    var user_phone=$("#phone").val();
    var data={
        mobile_no:user_phone,
        verify_code:code
    };
    $.ajax({
        type:"POST",
        data:data,
        url:"http://192.168.0.12/wdb007/user/login",
        success:function(res){
            dialog.toast(res.message, 30);
            console.log(res);
            sessionStorage.user_id=res.detail.userid;
            sessionStorage.user_token=res.detail.usertoken;
        }

    });
});
}(window, jQuery));

