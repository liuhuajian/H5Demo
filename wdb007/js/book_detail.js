/**
 * Created by lenovo on 2017/10/18.
 */
!$(function(win,$){
    var dialog = win.YDUI.dialog;
    function UrlSearch() {
        var name,value;
        var str=location.href; //取得整个地址栏
        var num=str.indexOf("?");
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){
            num=arr[i].indexOf("=");
            if(num>0){
                name=arr[i].substring(0,num);
                value=arr[i].substr(num+1);
                this[name]=value;
            }
        }
    }

    var Request=new UrlSearch();
    getDetailinfo(Request.shelf_code,Request.book_isbn,Request.ln,Request.la);
    if('wx_app' != Request.channel) {
        getCommend(Request.book_isbn);
    } else {
        $(".user-assess-list").hide();
    }
    getBorrowedUser(Request.book_isbn);
    console.log(Request.shelf_code,Request.book_isbn,Request.ln,Request.la);
	
    var address = window.location.href;
    thisDLoc = document.location;
    var hostPort = document.location.host;
    
    function getBorrowedUser(isbn){
    	var data = {
    	    isbn: isbn
    	};
    	$.ajax({
    	    type:"GET",
            //url: window.hostname + "/wdb007/bookgrid/queryBorrowedUser",
            url: 'https://api.wdb007.com/wdb007/bookgrid/queryBorrowedUser',
            data:data,
            success:function(res){
            	 console.log(res);
                 if(res.result==1){
                     showBorrowedUser(res.items, res.totalcount);
                 }else if(res.result==0){
                     $(".user-img").hide();
                 }
            }
    	});
    }
    
//请求详情接口
    function getDetailinfo(shelfCode,book_isbn,ln,la){
        var data={
            shelf_code:shelfCode,
            isbn:book_isbn,
            user_longitude:ln,
            user_latitude:la,
            map_type:0
        };
        $.ajax({
            type:"GET",
            //url:window.hostname + "/wdb007/bookgrid/queryBookInfo",
            url: 'https://api.wdb007.com/wdb007/bookgrid/queryBookInfo',
            data:data,
            success:function(res){
                console.log(res);
                if(res.result==1){
                    var detailData=res.detail;
                    initPage(detailData);
                }else{
                    dialog.notify(res.message, 3000);
                }
            }
        });
    }
//初始化页面详情
    function initPage(data){
//    轮播图片
        var siliderImg= data.bookbanners;
        var siliderhtml= "";
//        for(var i=0;i<siliderImg.length;i++){
//            siliderhtml+=" <div class='slider-item'><a href='javascript:void(0)'>";
//            siliderhtml+="<img src='"+siliderImg[i].bookurl+"' style='width:100%;height:5rem;'></a></div>";
//        }
//        $("#J_Slider").html("<div class='slider-wrapper'>"+siliderhtml+"</div>");
        // siliderhtml+=" <div class='slider-item'><a href='javascript:void(0)'>";
        // siliderhtml+="<img src='"+siliderImg[0].bookurl+"' style='width:50%;margin:0 auto;'></a></div>";
        // $(".slider-wrapper").html(siliderhtml);
//        var html="<img src='"+data.imgurl+"' alt=''>";
        $(".title-img").attr("src",siliderImg[0].bookurl);
        if(data.address == null || data.address == ''){
        	$(".bookshelf-position").hide();
        }else{
        	$(".address").html(data.address);
        }
        if(data.distance != null && data.distance != ''){
        	$(".distance").html(data.distance);
        }
        if(data.shelf_code != null && data.shelf_code != ''){
        	 $("#info-bookshelf").html(data.shelf_code);
        }else{
        	$("#info-bookshelf").parent().hide();
        }
        var count = 0;
        if(data.author_recommendation != null && data.author_recommendation!=""){
            $(".author-recommend").html("<div>"+data.author_recommendation+"</div>");
            count++;
        }else{
            $("#author-recommend").hide();
        }
        $("#info-author").html(data.author);
        $("#info-bookname").html(data.bookname);
        $("#publish-date").html(data.publish_date);
        $("#bookIsbn").html(data.isbn);
        $("#pub").html(data.press);
        
		if(data.describe != null && data.describe != ""){
			$(".book-intro-container").html(data.describe);
			count++;
		}else{
			$("#book-intro").hide();	
		}
        
        
        if(data.bookurls == null || !data.bookurls instanceof Array || data.bookurls.length == 0){
        	$("#book-picture").hide();
        }else{
        	count++;
        	var imgs =data.bookurls;
        	var html = "";
        	for(var i=0; i<imgs.length; i++){
        		html += "<img src='"+imgs[i].bookurl+"' alt=''>"
        	}
        	$(".book-picture").html(html);
        }
        
        if(count == 0){
        	$("#book_detail_text").hide();
        }
//        $('#J_Slider').slider({
//            speed: 200,
//            autoplay: 2000,
//            lazyLoad: true
//        });
    }
//加载用户评论信息
    function getCommend(isbn){
        var data={
            pagesize:10,
            pageno:1,
            isbn:isbn
        };
        console.log(data);
        $.ajax({
            type:"GET",
            url:window.hostname + "/wdb007/bookgrid/queryComments",
            data:data,
            success:function(res){
                console.log(res);
                if(res.result==1){
                    bookComment(res.items, res.totalcount);
                }else if(res.result==0){
                    $(".user-assess-list").hide();
                }
            }
        });
    }
//书籍评论
    function bookComment(data, totalcount){
        var count;
        var photohtml="";
        var html="";
        if(data == null || data.length == 0){
        	$(".assess-count").hide();
        }else{
            count=data.length;
            for(var i=0;i<count;i++){
            	if(i == 5){
            		break;
            	}
                var item=data[i];
                photohtml+="<div class='user-img-item'><img src='"+item.imgurl+"' alt=''></div>";
                html+="<div class='assess-detail-item'> <div class='assess-nicname'>";
                html+="<img src='"+item.imgurl+"' alt=''><span>"+item.username+"</span>";
                html+="<span class='assess-time'>"+item.timeago+"</span></div>";
                html+="<p class='assess-txt'>"+item.comments+"</p></div>";
            }
            $(".assess-left .count").html("("+totalcount+")");
            $(".assess-detail").html(html);
        }

    }
    
    function showBorrowedUser(data, count){
    	var photohtml="";
    	if(count == 0){
    		$(".user-img").hide();
    	}else{
    		for(var i=0; i<data.length; i++){
    			if(i==4){
    				break;
    			}
    			var item=data[i];
                photohtml+="<div class='user-img-item'><img src='"+item.imgurl+"' alt=''></div>";
    		}
			 var pho=" <div class='reader-count'> <span class='user-count'>"+data.length+"人已借阅</span></div>";
	         $(".user-img").html(pho+photohtml);
    	}
    	
    }
}(window, jQuery));
