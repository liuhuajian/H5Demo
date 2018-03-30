<template>
  <div class="container" >
    <div v-if="tip_content" class="tipContent">
         <span style="margin-left:10px">{{ tip_content }}</span>
    </div>

    <div class="content" >
        <div style="width:100%">
          <span class="vipType-title">请选择会员套餐</span>
          <div class="vipType-Content">
              <div v-for="vip in vip_list" class="vipItem" v-bind:key="vip.type"> 
                <div @click="sel_vip=vip" v-bind:class="[sel_vip.vip_type == vip.vip_type ? vipItemSel : vipItemNor]"> 
                    <div class="verticalCenter">
                        <div v-bind:class="[sel_vip.vip_type == vip.vip_type ? vipItemTitleSel : vipItemTitleNor]">{{vip.vip_content}}</div>
                        <div class="vipItem-subtext">{{'￥'+vip.vip_amount}}</div>
                    </div>
                </div>
              </div>
          </div>
      </div>

      <div class="payType-content">
          <span class="payType-title">选择支付方式</span>
          <div class="payItem"  @click="clickWechatPay">
              <div class="payItem-left">
                <img src="../assets/wechat.png" alt="图片" class="payType-img">
                <span class="payItem-title">微信</span>
              </div>
              
              <img class="payItem-img" src="../assets/chose_sel.png" id="wechat">
          </div>

          <div class="payItem"  @click="clickAlipay">
              <div class="payItem-left">
                    <img src="../assets/alipay.png" alt="图片" class="payType-img">
                    <span class="payItem-title">支付宝</span>
              </div>
              <img  class="payItem-img"  src="../assets/chose_nor.png" id="alipay">
          </div>
      </div>
      <div class="vip-rule">
          <img src="../assets/viprule.png" width="90%">
      </div>
      <div class="bottom-View">
          <img v-bind:src="selectImg" style="margin-top:13px" width="80%" id="rule">
          <div class="bottom-Btn" @click="toRequsetOrder">
            <span style="color:white">立即成为VIP会员</span>
          </div>
      </div>
      
  </div>
</div>
</template>

<script>

import axios from 'axios'
import chose_sel from '@/assets/chose_sel.png'
import chose_nor from '@/assets/chose_nor.png'
// import bg_img from '@/assets/vip_bgImg.png'

//http://192.168.0.12/wdb007/


export default {

    data : function(){
        return{
            vip_list:[],
            tip_content:'您的VIP特权将在2020年10月10日内截止，点击下列按钮为您的特权续费获取更多的特权时间。',
            selectImg:'',
            vipItemNor:'vipItem-nor',
            vipItemSel:'vipItem-sel',
            vipItemTitleSel:'vipItem-title-sel',
            vipItemTitleNor:'vipItem-title',
            sel_vip: {},
            isAlipay: false
        }
    },

    watch: {
      sel_vip: function(new_sel_vip){
          this.selectImg = new_sel_vip.vip_imgurl;
      },
      vip_list:function(new_vip_list){
          var vm = this;
          new_vip_list.forEach(function (vip,index){
              if (index == 0) {
                  vm.sel_vip = vip;
                  return;
              }
          })
      } 
    },

    methods: {
        clickAlipay: function(){
            this.isAlipay = true;
            document.getElementById('alipay').src = chose_sel;
            document.getElementById('wechat').src = chose_nor;
        },

        clickWechatPay: function(){
            this.isAlipay = false;
            document.getElementById('alipay').src = chose_nor;
            document.getElementById('wechat').src = chose_sel;
        },


        toRequsetOrder:function(){
            var href = 'vipAction?chargetype=1&'+'chargeamount='+this.sel_vip.vip_amount+'&vip_type='+this.sel_vip.vip_type+'&channel='+String(Number(this.isAlipay));
            window.location.href = href; 
        },

        fetchData:function(userId, userToken){
            var vm = this;
            var vipurl = 'charge/getVIPAmountList?userid='+userId+'&usertoken='+userToken;
            axios.get(vipurl)
            .then(function(response){
                vm.vip_list = response.data.detail.list;
                vm.tip_content = response.data.detail.tip_content;
            })
            .catch(function(err){
                console.log(err);
            });
        }
    },

    created:function(){
        this.fetchData(this.$route.params.userId,this.$route.params.userToken);
    },

}
</script>


<style lang="scss" scoped>
.borderStyle{
    border: solid;
    border-width: 1px;
    border-radius: 4px;
}

$norOrange : rgba(224,187,107,1);

.container{
    background:url(../assets/vip_bgImg.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
    text-align: left;
    margin-top: -6px;
    margin-left: -6px;
}

.tipContent{
    width:100%;
    height:60px; 
    background:rgba(224,187,107,0.3);
    font-size:12px;
    font-family:PingFangSC-Regular;
    color:$norOrange;
    display: flex;
    display: -webkit-flex;

    align-items: center;
    -webkit-align-items: center;
}

.content{
    display: flex;
    display: -webkit-flex;

    margin-left: 16px;
    margin-right: 16px;
    margin-top: 20px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;

    -webkit-flex-direction: row;
    -webkit-flex-wrap: wrap;
    -webkit-justify-content: space-between;
    -webkit-align-items: flex-start;

}


.vipType-title{
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(224,187,107,1);
    text-align: left;
}

.vipType-Content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center ;  

    display: -webkit-flex;
    -webkit-flex-direction: row;
    -webkit-flex-wrap: wrap;
    -webkit-justify-content: space-between;
    -webkit-align-items: flex-start ;


    margin-top: 16px;  
    text-align: center;  

}

.vipItem{
    text-align: center;
    display: block;
    width:48%;
    height: 54px;
    margin-bottom: 10px;
}

.verticalCenter{
    display: block;
}

.vipItem-nor{
    @extend .borderStyle;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    display: -webkit-flex;
    -webkit-flex-direction: column;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    text-align: center;


    background:rgba(255,255,255,1);
    border-color:  #F1F1F1;
    width:100%;
    height:54px;
}

.vipItem-sel{
    @extend .borderStyle;
    display: flex;
    text-align: center;
    
    flex-direction: column;
    justify-content: center;
    align-items: center;
    

    display: -webkit-flex;
    -webkit-flex-direction: column;
    -webkit-justify-content: center;
    -webkit-align-items: center;
    background:#FFFDF9;
    border-color:#E0BB6B;
    width:100%;
    height:54px;
    // margin-right: 10px;
}


.vipItem-title{
    font-size:16px;
    font-family:PingFangSC-Regular;
    color:#4A4A4A 100% ;
    display: block;
}
.vipItem-title-sel{
    font-size:16px;
    font-family:PingFangSC-Regular;
    color:rgba(224,187,107,1);
    display: block;
}

.vipItem-subtext{
    font-size:12px;
    font-family:PingFangSC-Medium;
    color:rgba(224,187,107,1);
    display: block;
}

.payType-content{
    text-align: left;
    margin-top:26px;
    width: 100%;
}

.payType-title{
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(94,94,94,1);
    line-height:20px;
}

.payItem{
    width: 100%;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;

    display: -webkit-flex;
    -webkit-flex-direction: row;
    -webkit-align-items: center;
    -webkit-justify-content: space-between;
}

.payItem-left{
    display: flex;
    flex-direction: row;
    align-items: center;


    display: -webkit-flex;
    -webkit-flex-direction: row;
    -webkit-align-items: center;

}

.payType-img{
    width:24px;
    height:24px;
}

.payItem-title{ 
    // width: 100%;
    height:14px;
    font-size:14px;
    font-family:STHeitiSC-Light;
    color:#5E5E5E;
    margin-left: 10px;
}

.payItem-img{
    width: 18px;
    height: 18px;
}

.vip-rule{
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top:50px;

    display: -webkit-flex;
    -webkit-justify-content: center;
    -webkit-align-items: center;

    margin-top:50px

}

.bottom-View{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 78px;


    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    -webkit-align-items: center;
    -webkit-justify-content: center;

}
.bottom-Btn{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    width: 80%;
    height: 45px;
    background-color: #E0BB6B;
    border-radius: 22.5px;
    box-shadow:0px 5px 5px #E0BB6B;
    display: -webkit-flex;
    -webkit-align-items: center;
    -webkit-justify-content: center;
}

</style>
















