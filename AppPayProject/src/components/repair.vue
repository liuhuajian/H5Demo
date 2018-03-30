<template>
  <div class="repair-container">
      <div class="success-view" v-if="isSuccess">
          <img src="../assets/success.png" alt="" class="success-img">
          <div class="success-title">报修成功</div>
          <div class="success-tips">我们会派出工作人员核实您提交的问题，<br>并在三个工作日内和您取得联系</div>
          <div class="bottom-btn-view">
                <div  class="bottomBtn"  @click="tapBackToIndex">
                    <span style="color:white">返回首页</span>
                </div>
            </div>
      </div>
      <div class="choose-view" v-else>
        <div class="top-view">
            <span class="top-view-left">书柜编号:{{shelfCode}}</span>
            <span class="top-view-right">{{grid}}柜</span>
        </div>
        <div class="line"></div>
        <div class="middle-view">
            <div class="middle-view-left">请选择异常类型</div>
            <div class="repair-type-container">
                <div class="repair-type">
                    <div style="width:31%" v-for="type in repairTyeps" :key="type.code" >
                        <div v-bind:class="[sel_type.code == type.code ? typeItemSel : typeItemNor]" @click="sel_type=type">
                            <span>{{type.text}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="middle-view">
            <div class="bottom-view-left" style="width:60px" ref="poststart">图片提交</div>
            <div class='picture'>
                <img  class='add_picture'  @click='chooseImage' src='../assets/picture_placeholder.png' v-if="pictures.length < 4"/>
                <div  class='selected_picture' v-for="(picture,index) in pictures" :key="picture">
                    <div class='seleted_item'>
                        <img v-bind:src='picture' class='selected_photo'/>
                        <img src='../assets/repair_delet.png' class='selected_delet'  @click='deletImageUrl(index)'/>
                    </div>
                </div>
            </div>
        </div>
        <div class="line"></div>
        <div class="bottom-view">
            <div class="bottom-view-left">备注</div>
            <div class='input-class'>
                <textarea v-model="remarkNote" class="note-textarea"></textarea>
            </div>
            <div class="bottom-btn-view">
                <div  class="bottomBtn"  @click="tapConfirmAction">
                    <span style="color:white">报修提交</span>
                </div>
                <!-- <div class="bottom-title">
                    <span >报修说明</span>
                </div> -->
            </div>
        </div>
      </div>
  </div>

</template>


<script>
import axios from "axios";
import server from "../utils/server.js";
import config from "../utils/config.js";

var dsBridge = require("dsbridge");

var instance = axios.create({
  baseURL: "https://api.wdb007.com/wdb007/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" }
});

export default {
  data() {
    return {
      repairTyeps: [
        { text: "无法开门", code: 1 },
        { text: "无法关门", code: 2 },
        { text: "图书破损", code: 3 },
        { text: "书柜损坏", code: 4 },
        { text: "结算错误", code: 5 },
        { text: "书籍数量", code: 6 },
        { text: "借阅费用", code: 7 },
        { text: "其 他", code: 8 }
      ],
      typeItemNor: "type-item-nor",
      typeItemSel: "type-item-sel",
      sel_type: { text: "无法开门", code: 1 },
      remarkNote: "",
      shelfCode: "",
      pictures: [],
      uploadImages: [],
      grid: "",
      isSuccess: false,
      loading: false
    };
  },

  methods: {
    chooseImage: function() {
      dsBridge.call("chooseImageFromMobile", "chooseImageFromMobile");
    },

    prepareUpLoad: function(base64Data) {
      console.log("#prepareUpLoad()");
      var that = this;
      return new Promise(function(resolve, reject) {
        let params = {
          usertoken: that.$route.query.usertoken,
          userid: that.$route.query.userid
        };
        server
          .post(config.ossInfoUrl, params)
          .then(data => {
            resolve(data.detail);
          })
          .catch(error => {
            console.log(data);
            reject(error);
          });
      });
    },

    uploadImage: function(base64Data) {
      let that = this;
      this.prepareUpLoad(base64Data).then(data => {
        var ossData = new FormData();
        let fileName = Date.parse(new Date()) + ".png";
        let fullNmae = data.host + "/" + data.dir + fileName;
        that.uploadImages.push(fullNmae);

        ossData.append("OSSAccessKeyId", data.accessid);
        ossData.append("policy", data.policy);
        ossData.append("Signature", data.signature);
        ossData.append("key", data.dir + fileName);
        ossData.append("success_action_status", 200); // 指定返回的状态码
        ossData.append(
          "file",
          that.convertBase64UrlToBlob(base64Data),
          fileName
        );

        axios
          .post(data.host, ossData)
          .then(x => {
            x.data;
            console.log(x);
          })
          .catch(error => {
            console.log(error);
          });
      });
    },

    tapConfirmAction: function() {
      this.confirmReport(this.sel_type.code, this.remarkNote);
    },

    deletImageUrl: function(index) {
      this.pictures.splice(index, 1);
      this.uploadImages.splice(index, 1);
    },

    tapBackToIndex: function() {
      dsBridge.call("toHomePage", "toHomePage");
    },

    confirmReport: function(code, remark) {
      dsBridge.call("showRepairPendding", "showRepairPendding");
      var vm = this;
      let uploadImages = Array.from(this.uploadImages);
      let urls = uploadImages.join()

      let params = {
        userid: this.$route.query.userid,
        usertoken: this.$route.query.usertoken,
        maintain_type: this.$route.query.maintain_type,
        describe: remark,
        imgUrls: urls,
        code:this.sel_type.code
      };

      console.log(params);

      server
        .post(config.repairUrl, params)
        .then(data => {
          console.log("#post", data);
          if (data.code == 0) {
            vm.isSuccess = true;
            dsBridge.call("showRepairSuccess", "showRepairSuccess");
          } else {
            dsBridge.call("showRepairError", data.message);
          }
        })
        .catch(error => {
          console.log(error);
          dsBridge.call("showRepairError", "showRepairError");
        });
    },

    convertBase64UrlToBlob: function(urlData) {
      var bytes = window.atob(urlData.split(",")[1]);
      var ab = new ArrayBuffer(bytes.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    }
  },

  mounted() {
    var vm = this;
    var shelfCode = this.$route.query.shelfCode;
    this.shelfCode = shelfCode;
    this.grid = shelfCode.substr(shelfCode.length - 2, 2);
    
    this.$nextTick(() => {
      dsBridge.call("H5Loadfinish","H5Loadfinish")
      dsBridge.register("addPicture", function(data) {
        vm.pictures.push(data);
        vm.uploadImage(data);
        return data;
      });
    });
  }
};
</script>


<style scoped>

.repair-container {
  background-color: white;
  width: 99vw;
  height: 110vh;
}

.choose-view {
  width: 100%;
}

.top-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
}

.top-view-left {
  height: 20px;
  margin-left: 12px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  color: rgba(75, 75, 75, 1);
}

.top-view-right {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  color: rgba(255, 179, 18, 1);
  margin-right: 12px;
}

.middle-view {
  display: flex;
  /* flex-direction: column; */
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.middle-view-left {
  margin-left: 12px;
  margin-top: 12px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: rgba(75, 75, 75, 1);
  width: 100px;
}

.repair-type-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.repair-type {
  width: 90%;
  margin-top: 14px;
  margin-bottom: 28px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.type-item-nor {
  height: 28px;
  font-size: 12px;
  color: #5e5e5e;
  border-radius: 14px;
  border: solid;
  border-color: #efefef;
  border-width: 1px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  /* margin-right: 5px; */
  margin-left: 5%;
}

.type-item-sel {
  height: 28px;
  font-size: 12px;
  color: #ffb312;

  border-radius: 14px;
  border: solid;
  border-color: #ffb312;
  border-width: 1px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  margin-left: 5%;
}

.bottom-view-left {
  width: 31px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: rgba(75, 75, 75, 1);
  line-height: 20px;
  margin-left: 13px;
  margin-top: 8px;
  margin-bottom: 10px;
}

.picture {
  width: 100%;
  height: 84px;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  padding-top: 10px;
  padding-left: 14px;
  padding-right: 14px;
}

.add_picture {
  width: 64px;
  height: 64px;
}

.seleted_item {
  width: 64px;
  height: 64px;
  margin-left: 10px;
  position: relative;
}

.selected_photo {
  width: 100%;
  height: 100%;
}

.selected_delet {
  width: 19px;
  height: 19px;
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
}

.input-class {
  width: 100%;
  height: 82px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.note-textarea {
  width: 90%;
  height: 82px;
  resize: none;
  border: solid 1px #f4f4f4;
  -webkit-appearance: none;
}

.line {
  width: 100vw;
  height: 8px;
  background: rgba(237, 237, 237, 1);
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

/* */

.success-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30%;
}

.success-img {
  /* margin-top: 30%; */
  max-width: 60px;
  max-height: 60px;
}

.success-title {
  margin-top: 10px;
  width: 64px;
  font-size: 16px;
  font-family: STHeitiSC-Light;
  color: rgba(255, 179, 18, 1);
  line-height: 16px;
}

.success-tips {
  margin-top: 10px;
  height: 14px;
  font-size: 14px;
  font-family: STHeitiSC-Light;
  color: rgba(94, 94, 94, 1);
  line-height: 20px;
}
</style>






