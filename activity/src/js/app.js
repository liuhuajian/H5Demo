
// 手机号判断
function isMobile(number) {
    var reg = /^1[3-9][0-9]{9}$/;
    return reg.test(number);
}

function getHeader() {
    var header = {
        ver: '0.1',
        source: 'app_h5',
        timestamp: Date.parse(new Date()),
        sign: ''
    };
    return header;
}

function get(url) {
    var defer = $.Deferred();
    var header = getHeader(url);

    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        headers: header,
        async: true

    }).done(function (data) {
        defer.notify(data);//progress
        if (data === undefined) {
            defer.reject(204);
            return;
        }
        defer.resolve(data);

    }).fail(function (xhr, status, error) {
        defer.reject(xhr);
    });

    return defer;
}

function post(url, jsonObj) {
    console.dir(jsonObj);
    var defer = $.Deferred();
    // var encodedJson = encodeURIComponent(JSON.stringify(jsonObj));
    var header = getHeader(url);

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        data: jsonObj,
        headers: header,
        async: true

    }).done(function (data) {
        defer.notify(data);
        defer.resolve(data);

    }).fail(function (xhr, status, error) {
        defer.reject(xhr);
    });

    return defer;
}

// 获取url所携带参数
function GetRequest() {

    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
