<template>
  
    <div class="container" id="topup">
        <div class="topup-desposite" v-if="charge_type=='0' "><span>99元押金</span></div>
        <img src="../assets/cash.png"width="100%" height="20px" v-if="charge_type=='0'">
        <span class="topup-type">请选择充值金额</span>

        <div class="topup-cashContent">
            <div v-for="charge in charges" key="charge_code" class="topup-cash">
                <div    @click="selectedPayCashItem(charge)" v-bind:class="[sel_charge.charge_code == charge.charge_code ? cashSelClass : cashClass]">
                    <span>{{ charge.charge_amount }}</span>
                </div>
            </div>
        </div>
        
        <div  class="payType-Content">
          <span class="payType-title">选择支付方式</span>
          <div class="payItem"  @click="clickWechatPay">
              <div class="payItem-left">
                <img src="../assets/wechat.png" alt="图片" class="payType-img">
                <span class="payItem-title">微信</span>
              </div>
              <img class="payItem-img" src="../assets/payType_sel.png" id="wechat">
          </div>

          <div class="payItem"  @click="clickAlipay">
              <div class="payItem-left">
                <img src="../assets/alipay.png" alt="图片" class="payType-img">
                <span class="payItem-title">支付宝</span>
              </div>
              <img  class="payItem-img"  src="../assets/payType_no.png" id="alipay">
          </div>
          <div class="bottom-view">
              <div class="bottomBtn" @click="toRequsetOrder">
                <span style="color:white">立即充值</span>
              </div>
              <div class="bottom-title">
                <span @click="toTopupProtocol">点击立即充值，即表示您已同意《充值协议》</span>
              </div>
          </div>
        </div>

      </div>

    </div>



</template>




<script>

import axios from 'axios'
import chose_sel from '@/assets/payType_sel.png'
import chose_nor from '@/assets/payType_no.png'


export default {
    
    data(){
        return{
            charges: [],
            charge_type: '0',// 0 代表 押金充值，1 代表余额充值
            sel_charge:{},
            cashSelClass: 'topup-cash-select',
            cashClass: "topup-cash-item",
            isAlipay : false
        }
    },

    watch: {
      charges:function(new_charges){
          var vm = this;
          new_charges.forEach(function (charge,index){
              if (index == 0) {
                vm.sel_charge = charge;

              }
          })
      }  
    },

    methods: {
        //  点击支付宝支付
        clickAlipay: function(){
            this.isAlipay = true;
            document.getElementById('alipay').src = chose_sel;
            document.getElementById('wechat').src = chose_nor;
        },
        // 点击微信支付
        clickWechatPay: function(){
            this.isAlipay = false;
            document.getElementById('alipay').src = chose_nor;
            document.getElementById('wechat').src = chose_sel;
        },
        // 点击选择
        selectedPayCashItem:function(charge){
            if(this.charge_type == "0" && this.sel_charge.charge_code == charge.charge_code){
                this.sel_charge = {};
            }else{
                this.sel_charge = charge;
            }
            
        },

        // 点击充值按钮
        toRequsetOrder:function(){
            var href;
            if(typeof(this.sel_charge.charge_code)=="undefined"){
                href = 'topupAction?chargetype='+this.charge_type+'&chargeamount=0_99'+'&channel='+String(Number(this.isAlipay));
            }else{
                href = 'topupAction?chargetype='+this.charge_type+'&chargeamount='+this.sel_charge.charge_code+'&channel='+String(Number(this.isAlipay));
            }
            window.location.href = href; 
        },

        toTopupProtocol:function(){
            window.location.href = "https://api.wdb007.com/wdb007/license.html";
        },

        fetchData:function(userId, userToken){
            var vm = this
            var cashUrl = 'charge/getChargeAmountList?userid=' + userId + '&usertoken='+userToken;
            axios.get(cashUrl)
            .then(function(response){
                vm.charges = response.data.detail.charges;
                vm.charge_type = response.data.detail.charge_type;
            })
            .catch(function(err){
                console.log(err);
            });   
        }
    },

    created () {
        this.fetchData(this.$route.params.userId,this.$route.params.userToken);
    },

    mounted () {
      document.getElementsByClassName('topup-cash-sel').width = (screen.width-42)/2.0;  
    }


}
</script>



<style lang="scss" scoped>

.borderStyle{
    border: solid;
    border-width: 1px;
    border-radius: 4px;
}

.container{
    margin-top: 18px;
    margin-left: 16px;
    margin-right: 16px;
    text-align: left;
}

.topup-type{
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(8,8,8,1);
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
}

.topup-cashContent{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    
    display: -webkit-flex;
    -webkit-flex-direction: row;
    -webkit-flex-wrap: wrap;
    -webkit-justify-content: space-between;
    -webkit-align-items: flex-start;
    
    margin-top: 24px;
    text-align: center;
}

.topup-cash{
    display: inline-block;
    width:48%;
    height: 54px;
    margin-bottom: 10px;
}

.topup-cash-item{
    @extend .borderStyle;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-align-items: center;
    -webkit-justify-content: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4A4A4A;
    border-color: #F1F1F1;
    
    width:100%;
    height: 54px;

}

.topup-cash-select{
    @extend .borderStyle;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-align-items: center;
    -webkit-justify-content: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFB312;
    border-color: #FFB312;

    width:100%;
    height:54px; 
}

.topup-desposite{
    @extend .borderStyle;
    display: -webkit-flex;
    display: flex;
    justify-content: center;
    align-items: center;

    -webkit-justify-content: center;
    -webkit-align-items: center;
    width:48%;

    display: flex;
    justify-content: center;
    align-items: center;

    height:54px;
    color: #FFB312;
    border-color: #FFB312;
    margin-bottom:27px 
}

.payType-Content{
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
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    -webkit-flex-direction: row;
    -webkit-justify-content: space-between;
    -webkit-align-items: center;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    padding-bottom: 10px;
}

.payItem-left{

    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    align-items: center;
    -webkit-align-items: center;

    flex-direction: row;
    align-items: center;

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
    color:rgba(94,94,94,1);
    line-height:14px;
    margin-left: 10px;
}

.payItem-img{
    width: 18px;
    height: 18px;
}

.bottom-view{
    display: -webkit-flex;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;


    -webkit-flex-direction: column;
    -webkit-justify-content: center;
    -webkit-align-items: center;

    text-align: center;
    margin-top: 43px;
}

.bottomBtn{

    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;

    -webkit-align-items: center;
    -webkit-justify-content: center;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 45px;
    width: 80%;
    background-color: #FFB312;
    border-radius: 22.5px;
    box-shadow:0px 5px 5px #FFB312;
}

.bottom-title{
    font-size:10px;
    font-family:PingFangSC-Regular;
    color:rgba(155,155,155,1);
    margin-top: 12px;
}








</style>


