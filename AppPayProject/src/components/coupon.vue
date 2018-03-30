<template>

    <div class="container">
        <div class="segment_control">
            <span :class="sel_seg_item == 1 ? 'segment_item_sel': 'segment_item'" @click="changeSegmentIndex(1)">未使用（{{valid_list.length}}）</span>
            <span :class="sel_seg_item == 2 ? 'segment_item_sel': 'segment_item'" @click="changeSegmentIndex(2)">已使用（{{used_list.length}}）</span>
            <span :class="sel_seg_item == 3 ? 'segment_item_sel': 'segment_item'" @click="changeSegmentIndex(3)">已过期（{{overtime_list.length}}）</span>
        </div>

        <div v-if="list.length < 1" class="empty_container">
          <div>
            <img class="empty_img" src="../assets/empty_coupon.png">
          </div>
          <div class="empty_tip">
            <span>还没有券哦～</span>
          </div>
        </div>
        <div class="list_container" v-for="(item,index) in list" :key="index" v-else>
            <div class="list_item">
                <div class="list_item_top">
                    <div class="list_item_top_left">
                        <span class="list_item_top_left_title">{{ item.coupon_cash }}</span>
                        <span class="list_item_top_left_subtTitle">{{item.coupon_condition}}</span>
                    </div>
                    <div class="list_item_top_right">
                        <div class="list_item_top_right_line" style="margin-bottom:22px">
                            <div class="list_item_top_right_tip">
                                <span>{{item.coupon_type}}</span>
                            </div>
                            <div class="list_item_top_right_desc">
                                <span>{{item.coupon_desc}}</span>
                            </div>
                        </div>
                        <div class="list_item_top_right_line">
                            <div class="list_item_top_right_time">{{item.over_time}}</div>
                            <div class="near_time" v-if="sel_seg_item == 1 && item.isNear">快到期</div>    
                            <div class="item_image_container">
                                <img class="item_image" src="../assets/coupon_used.png"  v-if="sel_seg_item == 2" alt="">
                                <img class="item_image" src="../assets/coupon_overtime.png"  v-else-if="sel_seg_item == 3" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="seperat_container">
                        <div class="seperat_circel"></div>
                        <div class="seperat_line"></div>
                        <div class="seperat_circel"></div>
                    </div>
                </div>

                <div class="list_item_bottom">
                    <div class="list_item_bottom_left" >
                        <span style="margin-left:12px" :id="'coupon_verify_'+index" v-if="sel_seg_item != 1">{{item.coupon_short}}</span>
                        <span style="margin-left:12px" :id="'coupon_verify_'+index" v-else>{{item.coupon_short}}</span>
                    </div>
                    <div class="list_item_bottom_right" v-if=" item.coupon_info.length>21">
                        <img src="../assets/pull_down.png" class="more_btn" :id="'showMore_'+index" @click="showMoreInfo(index)">
                    </div>
                </div>
            </div>

        </div>


    </div>
  
</template>



<script>
import server from "../utils/server.js";
import config from "../utils/config.js";
import utils from "../utils/utils.js";
import coupon_used from "@/assets/coupon_used.png";
import coupon_overtime from "@/assets/coupon_overtime.png";
import pull_down from "@/assets/pull_down.png";
import pull_up from "@/assets/pull_up.png";

export default {
  data() {
    return {
      sel_seg_item: 1,
      list: [],
      valid_list: [],
      used_list: [],
      overtime_list: [],
      showMoreIndex: 9999,
      lastShowIndex: 9999
    };
  },

  beforeCreate() {
    document.querySelector("body").setAttribute("style", "background:#F4F4F4");
  },
  beforeDestroy() {
    document.querySelector("body").setAttribute("style", "");
  },

  created() {
     this.getCouponList();
  },


  methods: {
    changeSegmentIndex: function(index) {
      this.showMoreInfo(this.showMoreIndex);
      this.sel_seg_item = index;
      this.lastShowIndex = 9999;
      this.showMoreIndex = 9999;
      if (index == 1) {
        this.list = this.valid_list;
      } else if (index == 2) {
        this.list = this.used_list;
      } else if (index == 3) {
        this.list = this.overtime_list;
      }
    },

    showMoreInfo: function(index) {
      if (this.sel_seg_item != 1) return;

      this.showMoreIndex = index;

      if (this.lastShowIndex != 9999) {
        console.log(contentIdName, showImgIdName);
        let item = this.valid_list[this.lastShowIndex];
        let contentIdName = "coupon_verify_" + this.lastShowIndex;
        let showImgIdName = "showMore_" + this.lastShowIndex;
        document.getElementById(contentIdName).textContent = item.coupon_short;
        document.getElementById(showImgIdName).src = pull_down;
      }

      if (this.showMoreIndex == this.lastShowIndex) {
        this.lastShowIndex = 9999;
        return;
      }

      let item = this.valid_list[index];
      let contentIdName = "coupon_verify_" + index;
      let showImgIdName = "showMore_" + index;
      document.getElementById(contentIdName).textContent = item.coupon_info;
      document.getElementById(showImgIdName).src = pull_up;

      this.lastShowIndex = index;
    },

    getCouponList: function() {
      let that = this;
      let params0 = {
        oper: 0,
        userid: this.$route.query.userid,
        usertoken: this.$route.query.usertoken
      };

      let params1 = {
        oper: 1,
        userid: this.$route.query.userid,
        usertoken: this.$route.query.usertoken
      };

      let params2 = {
        oper: 2,
        userid: this.$route.query.userid,
        usertoken: this.$route.query.usertoken
      };
      server.get(config.couponList, params0).then(data => {
        that.valid_list = data.items.map(item => {
          if (item.coupon_info.length > 21) {
            item.coupon_short = item.coupon_info.substr(0, 18) + "...";
          } else {
            item.coupon_short = item.coupon_info;
          }
          return item;
        });
        that.list = that.valid_list;
      });

      server.get(config.couponList, params1).then(data => {
        that.used_list = data.items.map(item => {
          if (item.coupon_info.length > 21) {
            item.coupon_short = item.coupon_info.substr(0, 18) + "...";
          } else {
            item.coupon_short = item.coupon_info;
          }
          return item;
        });
      });

      server.get(config.couponList, params2).then(data => {
        that.overtime_list = data.items.map(item => {
          if (item.coupon_info.length > 21) {
            item.coupon_short = item.coupon_info.substr(0, 18) + "...";
          } else {
            item.coupon_short = item.coupon_info;
          }
          return item;
        });
      });
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
}

.segment_control {
  width: 100%;
  height: 34px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.segment_item {
  width: 33%;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: #9c9c9c;
  line-height: 20px;
}

.segment_item_sel {
  width: 33%;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Semibold;
  color: #ffb312;
  line-height: 20px;
}

.empty_container {
      width: 100%;
    height: 60vh;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
  background: #f4f4f4;
}

.empty_img {
  width: 100px;
  height: 100px;
}

.empty_tip {
  margin-top: 20px;
  font-size: 14px;
  color: rgba(156, 156, 156, 1);
}

.list_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f4f4;
}

.list_item {
  width: 85%;
  margin-top: 13px;
  background: white;
  border-radius: 4px;
}

.list_item_top {
  width: 100%;
  margin-top: 15px;
  display: flex;
  padding-bottom: 18px;
  position: relative;
}

.seperat_container {
  display: flex;
  width: 104%;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: -7px;
  left: -2%;
}

.seperat_line {
  width: 100%;
  height: 2px;
  background: #f3f3f3;
}

.seperat_circel {
  width: 14px;
  height: 14px;
  background: #f4f4f4;
  border-radius: 7px;
}

.list_item_top_left {
  width: 26%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list_item_top_left_title {
  width: 50px;
  height: 30px;
  font-size: 30px;
  font-family: STHeitiSC-Light;
  color: rgba(255, 179, 18, 1);
  line-height: 31px;
}

.list_item_top_left_subtTitle {
  height: 12px;
  font-size: 12px;
  font-family: STHeitiSC-Light;
  color: rgba(155, 155, 155, 1);
  margin-top: 7px;
}

.list_item_top_right {
  width: 64%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.list_item_top_right_line {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.list_item_top_right_tip {
  width: 36px;
  height: 16px;
  background: rgba(255, 137, 133, 1);
  border-radius: 2px;
  font-size: 10px;
  color: white;
}

.list_item_top_right_desc {
  height: 16px;
  font-size: 16px;
  font-family: STHeitiSC-Light;
  color: rgba(8, 8, 8, 1);
  margin-left: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  text-align: left;
}

.list_item_top_right_time {
  width: 132px;
  height: 12px;
  font-size: 12px;
  font-family: STHeitiSC-Medium;
  color: rgba(185, 185, 185, 1);
  line-height: 12px;
}

.near_time {
  width: 40px;
  height: 14px;
  background: rgba(155, 155, 155, 1);
  color: white;
  font-size: 10px;
  margin-left: 3px;
}

.list_item_bottom {
  width: 100%;
  background: #fbfbfb;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #5e5e5e;
  border-radius: 4px;
}

.list_item_bottom_left {
  width: 80%;
  margin-top: 8px;
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-start;
  text-align: left;
}

.list_item_bottom_right {
  width: 20%;
}

.more_btn {
  width: 18px;
  height: 18px;
}

.item_image_container {
  position: absolute;
  z-index: 3;
  right: 0;
}

.item_image {
  width: 92px;
  height: 69px;
}
</style>

