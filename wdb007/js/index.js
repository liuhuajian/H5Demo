/**
 * Created by lenovo on 2017/10/11.
 */

var indexData={};  //获取最近书柜以及经纬度
var start = new Date().getTime();
var cc;
var map, geolocation;
//加载地图，调用浏览器定位服务
map = new AMap.Map('amap', {
    resizeEnable: true
});
map.plugin('AMap.Geolocation', function() {
    geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 200,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'RB'
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();
    cc = new Date().getTime();
    console.log("start:   "+ cc);
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
    //AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    var dd = new Date().getTime();
    console.log("During1:   "+ (dd-cc));
});
//解析定位结果
function onComplete(data) {
    var ee = new Date().getTime();
    console.log("During2:   "+ (ee-cc));
    console.log(data);
    var map_lng=data.position.getLng();
    var map_lat=data.position.getLat();
    sessionStorage.ln=data.position.getLng();
    sessionStorage.la=data.position.getLat();
    var end = new Date().getTime();
    console.log("花费时间：" + (end -start) + " ms");
    getCloseBookshelf(map_lng,map_lat);
    console.log(map_lng,map_lat);
}
//解析定位错误信息
function onError(data) {
    alert("定位失败");
}
//获取最近书柜信息
function getCloseBookshelf(ln,la){
    var data={
        user_longitude:ln,
        user_latitude:la,
        map_type:0
    };
    $.ajax({
        type:"GET",
        data:data,
        url:"http://192.168.0.12:8080/wdb007/bookgrid/getHomePage",
        success:function(res){
            if(res.result==1){
                sessionStorage.bookshelfCode=res.detail.bookshelf_code;
                indexData.bookshelfCode=res.detail.bookshelf_code;
                indexData.latitude=res.detail.latitude;
                indexData.longitude=res.detail.longitude;
                //初始化书库列表
                var initData={
                    pagesize:10,
                    pageno:1,
                    shelf_code:indexData.bookshelfCode
                };
                getOnePageMessage(initData);
            }else{
                alert(res.message);
            }
        }
    });

}
//获取年龄段和标签
function getAgelabel(){
    $.ajax({
        type:"GET",
        url:"http://192.168.0.12:8080/wdb007/bookgrid/queryTagAgeList",
        success:function(res){
            if(res.result==1){
                var ageData=res.detail.ages;
                var tagData=res.detail.tags;
                var age_html="";
                var tag_html="";
                age_html+="<a href='javascript:void(0)' id='age_sear' data-readable='' class='age-active'>全部</a>";
                for(i=0;i<ageData.length;i++){
                    var item=ageData[i];
                    age_html+="<a href='javascript:void(0)' data-readable="+item.readable+">"+item.age+"</a>";
                }
                $(".age-search").html(age_html);
            //    主题
                for(var j=0;j<tagData.length;j++){
                    var tagItem=tagData[j];
                    tag_html+="<li class='theme-item theme-active' data-tag="+tagItem.tag_code+">"+tagItem.tag_name+"</li>"
                }
                $(".theme-list").html(tag_html);
            }else{
                alert(res.message);
            }
        }
    });
}
getAgelabel();

//分页加载书库列表
function getOnePageMessage(data){
    var itemCount;
    var items;
    isLoading = false;
    $.ajax({
        url : "http://192.168.0.12:8080/wdb007/bookgrid/queryShelfBookList",
        type : "GET",
        dataType: "json",
        data: data,
        success : function (res) {
            console.log(res);
            if (res.result == 1){
                items = res.items;
                if (items.length!= 0) {
                    isLoading = true;
                    var html="";
                    var col_html="";
                    for(var i=0;i<items.length;i++){
                        var img_html="";
                        var item=items[i];
                        var book_detail=item.describe;
                        var book_info=book_detail.substring(0,23)+"...";
                        html+=" <a href='html/book_detail.html?shelf_code="+sessionStorage.bookshelfCode+"&book_isbn="+item.isbn+"&ln="+sessionStorage.ln+"&la="+sessionStorage.la+"' class='grids-item'>";
                        html+="<div class='grids-icon'><img src='"+item.imgurl+"' style='width:95%;height:4rem;'></div><div class='grids-txt'>";
                        for(var j=0;j<item.recommendation;j++){
                            img_html+="<img src='images/library_stares_sel@2x.png' style='max-width:9%;' alt=''>";
                        }
                        for(var k=0;k<5-item.recommendation;k++){
                            img_html+="<img src='images/library_stares_no@2x.png' style='max-width:9%;' alt=''>";
                        }
                        html+="<p class='book-name'>"+item.bookname+"</p><div class='assess'>"+img_html+"</div>";
                        html+="<div class='borro-count-container'><span class='borro-count'>"+item.borrow_count+"人借阅</span>";
                        html+="<img src='images/library_cellect@2x.png' style='max-width:12%;float:right'></div></div></a>";
                        col_html+="<a href='html/book_detail.html?book_isbn="+item.isbn+"' class='list-item'>";
                        col_html+="<div class='list-img'><img src='"+item.imgurl+"'> </div>";
                        col_html+="<div class='list-mes'><h3 class='list-title'>"+item.bookname+"</h3>";
                        col_html+=" <div class='list-mes-item'> <div><p class='list-price'>作者："+item.author+"</p>";
                        col_html+="<p class='book-intro'><span class='intro-title'>简介：</span>"+book_info+"</p>";
                        col_html+="<p class='read-count'><img src='images/library_collect@2x.png' style='max-width:7%;display: inline-block;vertical-align: middle' alt=''>";
                        col_html+="<span class='borro-count'><b>"+item.borrow_count+"</b>人借阅</span>";
                        col_html+="<span class='assess' style='float: right;'>"+img_html+"</span></p></div></div></div></a>";
                    }
                    $(".book-container .m-grids-2").html(html);
                    $("#book_container_col").html(col_html);
                }else if(items.length= 0){
                    dialog.notify("无更多数据", 2000);
                }
            }else{
               alert(res.message);

            }
        }
    });
    //页面滑动最下方加载更多
    $(window).scroll(function(){
        if (isLoading == true) {
            if (($("body").height() - $("body").scrollTop()) <= document.documentElement.clientHeight) {
                messagePage++;
                getOnePageMessage(data);
            }
        }
    });
}
//根据年龄段模糊索搜
$(".age-search").on("click","a",function(){
    $(this).addClass("age-active").siblings(".age-active").removeClass("age-active");
    var age_count=$(this).data("readable");
    var data={
        pagesize:1,
        pageno:10,
        readable:age_count,
        shelf_code:sessionStorage.bookshelfCode
    };
    console.log(data);
    getOnePageMessage(data);
});
//根据主题模糊索搜
$(".theme-sel").click(function(){
    $("#theme_list").toggleClass("show-control");
});

$("#theme_list").on("click",".theme-item",function(){
    $(this).addClass("theme-active").siblings(".theme-active").removeClass("theme-active");
    var tag=$(this).data("tag");
    var age_data=$(".age-search .age-active").data("readable");
    var post_data={
        pagesize:1,
        pageno:10,
        readable:age_data,
        topical_code:tag,
        shelf_code:sessionStorage.bookshelfCode
    };
    console.log(post_data);
    getOnePageMessage(post_data);
});
//筛选
$(".lib-sel").click(function(){
    $("#lib_sel").toggleClass("show-control");
});
$("#lib_sel").on("click",".theme-item",function(){
    var sort_count=$(this).data("sort");//筛选
    var age_data=$(".age-search .age-active").data("readable");//年龄段
});

