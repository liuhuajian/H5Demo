<template>
    <div class="container">
        <div class="top_view">
            <div class="header_text">
                <span>退款原因</span>
            </div>
            <div class="list_container">
                <div :class="[sel_item == item ? 'list_item_sel':'list_item']" v-for="(item,index) in reasionList" :key="index" @click="sel_item = item">
                    <span>{{item}}</span>
                </div>
            </div>
        </div>

        <div class="bottom_view">
            <div class="header_text">
                <span>其他</span>
            </div>
            <div class="remark_view_container">
                <textarea name="" class="remark_view" v-model="remarkNote"></textarea>
            </div>
        </div>

        <div class="bottom-btn-view">
            <div  class="bottomBtn"  @click="tapConfirmAction">
                <span style="color:white">立即退款</span>
            </div>
        </div>
    </div>
</template>

<script>
import server from "../utils/server.js";
import config from "../utils/config.js";
import { MessageBox } from "mint-ui";
import { Indicator } from 'mint-ui';

export default {
  data() {
    return {
      reasionList: [
        "书籍年龄段太小",
        "借还不方便",
        "没有想看的书",
        "没有爱过，差评",
        "书籍更新慢",
        "借阅价格贵",
        "周边书柜太少",
        "下回想看再付押金",
        "押金太高"
      ],
      remarkNote: "",
      sel_item: "书籍年龄段太小"
    };
  },

  methods: {
    tapReasionItem: function(item) {
      this.sel_item = item;
    },
    tapConfirmAction: function() {
      let that = this;
      MessageBox.confirm(
        "押金确认退还后，账号将处于锁定状态，请确认是否退还押金?",
        "退还押金"
      ).then(action => {
        that.backDeposit();
      });
    },

    backDeposit: function() {
      Indicator.open('正在请求退款...');
      let that = this;
      let data = {
        userid: this.$route.query.userid,
        usertoken: this.$route.query.usertoken,
        refundReason: this.sel_item,
        memo: this.remarkNote
      };
      let url = config.refundDeposit;
      server.post(url, data).then(data => {
        Indicator.close()
        console.log(data);
        MessageBox({
          title: "提示",
          message: data.message,
          showCancelButton: false
        }).then(action => {
          that.toFrontPage();
        });
      });
    },

    toFrontPage: function() {
      if (this.isWechat) {
        wx.miniProgram.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
        });
      }
    }
  },

  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#F4F4F4");
  },
  beforeDestroy() {
    document.querySelector("body").setAttribute("style", "");
  },

  mounted() {
    window.__wxjs_environment === "miniprogram";
    this.isWechat = window.__wxjs_environment === "miniprogram";
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  background: #f4f4f4;
}

.top_view {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 23px;
  background: white;
}

.header_text {
  margin-top: 11px;
  width: 102px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: rgba(75, 75, 75, 1);
  line-height: 20px;
}

.list_container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.list_item {
  margin-top: 12px;
  width: 27%;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: solid;
  border-width: 1px;
  border-color: #efefef;
  font-size: 12px;
  color: #5e5e5e;
}

.list_item_sel {
  margin-top: 12px;
  width: 27%;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: solid;
  border-width: 1px;
  border-color: #ffb312;
  font-size: 12px;
  color: #ffb312;
}

.bottom_view {
  margin-top: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 23px;
  background: white;
}

.remark_view_container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}

.remark_view {
  width: 80%;
  resize: none;
  border: solid 1px #f4f4f4;
  -webkit-appearance: none;
  height: 82px;
}

.bottom-btn-view {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  -webkit-flex-direction: column;
  -webkit-justify-content: center;
  -webkit-align-items: center;

  text-align: center;
  margin-top: 43px;
}

.bottomBtn {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;

  -webkit-align-items: center;
  -webkit-justify-content: center;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  height: 45px;
  width: 80%;
  background-color: #ffb312;
  border-radius: 22.5px;
  box-shadow: 0px 5px 5px RGBA(255, 179, 18, 0.3);
}

.bottom-title {
  margin-top: 21px;
  width: 56px;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  color: rgba(255, 179, 18, 1);
  line-height: 17px;
}
</style>


