<template>
  <div class="page">
    <div class="container" style="width: 1032px">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="nav-bread">
        <el-breadcrumb-item to="/personal">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item to="/personal/order/myOrder">我的订单</el-breadcrumb-item>
        <el-breadcrumb-item class="active">商品评价</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="apply-main">
        <div class="main" v-for="(item, index0) in orderDetail">
          <div class="main-child">
            <div class="flBox">
              <div class="shop-pic">
                <img :src="getPicture+item.pic1" width="180" height="180"/>
              </div>
              <p class="shop-title">{{item.name}}</p>
              <h4 class="shop-prize">{{item.myPrice | price}}</h4>
            </div>
            <div class="frBox">
              <div class="shop-xing">
                <div class="shop-xing-name">商品评分{{item.score}}</div>

                <el-rate class="el-xing"
                         v-model="scoreList[index0]"
                         :colors="['#99A9BF', '#F7BA2A', '#F7BA2A']">
                </el-rate>
              </div>
              <div class="shop-xing">
                <div class="shop-xing-name">商品评价</div>
                <textarea class="text-area" v-model="contentList[index0]"></textarea>
              </div>
              <div class="shop-xing">
                <div class="shop-xing-name inTn">晒单</div>
                <div class="shop-shaiPic">
                  <el-upload
                    class="upload-demo"
                    action="123"
                    :file-list="imageList"
                    list-type="picture">
                    <el-button size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                  </el-upload>
                  <p class="cx-shai">最多可上传3张图片，每张图片大小不超过5M，支持bmp,gif,jpg,png,jpeg格式文件</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottomSub">
        <div class="submit-btn" @click="addComments">提交</div>
      </div>

    </div>
  </div>
</template>

<script>
import upload from "@/components/upload";
import { addComments, updateOrderStatusCommented,getOrderDetail,getPicture } from "@/const/api";

export default {
  name: "judge",
  layout: "personal-layout",
  components: {
    upload
  },
  data() {
    return {
      index: [],
      num1: 1,
      multiple: true,
      textarea: "",
      activeTab: 1,
      value1: null,
      value2: null,
      orderDetail: {},
      scoreList: [],
      contentList: [],
      imageList: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    }
  },
  mounted() {
    if (!this.$route.params || !this.$route.params.id) {
      return;
    }
    this.getMyOrderDetail();
    // this.getComments();
  },
  methods: {
    submitUpload() {
      this.$confirm(`您确认上传所选图片吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.$post(getPicture, {
            user: this.isLogin,
            goodid: this.productId
          })
            .then( () => {

            })
            .catch()
        })
        .catch()
    },
    // async getComments() {
    //   let rst = await this.$store.dispatch(
    //     "orders/getCommentsAction",
    //     this.$route.params.id
    //   );
    // },
    handleReplace(index, index0) {
      this.index[index0] = index;
      this.multiple = false;
    },
    handleReplace2() {
      this.multiple = true;
    },
    // onUpload({ result, index }, index0) {
    //   if (this.multiple) {
    //     // 继续添加
    //     if (typeof result.length == "string") {
    //       //  单个元素
    //       if (this.imageList[index0].length <= 5) {
    //         let tempArray = this.imageList[index0];
    //         tempArray.push(result);
    //         this.$set(this.imageList, index0, tempArray);
    //       } else {
    //         this.$message.error(
    //           "一次最多上传6张图片，当前还能继续添加1张图片。"
    //         );
    //         return;
    //       }
    //     } else {
    //       //  多个元素
    //       if (this.imageList[index0].length + result.length <= 6) {
    //         let tempArray = this.imageList[index0].concat(result);
    //         this.$set(this.imageList, index0, tempArray);
    //         //todo:::  查看vue文档  看concat 是否为正确语法
    //       } else {
    //         this.$message.error(
    //           `一次最多上传6张图片，当前还能继续添加${6 -
    //             this.imageList[index0].length}张图片。`
    //         );
    //         return;
    //       }
    //     }
    //   } else {
    //     //替换当前图片
    //     this.imageList[index0].splice(index, 1, result);
    //   }
    //   console.log(this.imageList[index0], this.index, index0);
    // },

    async getMyOrderDetail() {
      let rst = await this.$axios.$get(`${getOrderDetail}?user=${this.user}&goodid=${this.$route.params.id}`);
      this.orderDetail = rst;
      // this.orderDetail.map((item, index) => {
      //   this.scoreList[index] = null;
      //   this.contentList[index] = "";
      //   this.imageList[index] = [];
      //   this.index[index] = 0;
      // });
    },

    async addComments() {
      if (!this.orderDetail) {
        return;
      }

      var isEmptyContent = false;
      let skuMap = [];
      this.orderDetail.map((item, index) => {
        if (this.contentList[index] == "") {
          isEmptyContent = true;
        }
        skuMap[index] = {
          orderId: this.$route.params.id,
          itemId: item.itemId,
          content: this.contentList[index], //内容，必须
          //"evaluationId": null,原始评价id，不为空代表是追加评价
          satisfactionScore: this.scoreList[index], //满意度评分，必须
          logisticsServiceScore: 5, //物流服务，非必须
          serviceAttitudeScore: 5, //服务态度，非必须
          imageUrl: this.imageList[index].join(",")
        };
      });

      if (isEmptyContent) {
        this.$message("内容不能为空");
        return;
      }
      this.$axios
        .$post(addComments, skuMap)
        .then(() => {
          // this.$message.success('发送成功')
          this.$axios
            .$get(
              updateOrderStatusCommented + `?orderId=${this.$route.params.id}`
            )
            .then(result => {
              if (result.payload === "1") {
                //1表示成功
                this.$message.success("评价发布成功");
                this.$router.back();
              } else {
                //0表示失败
                this.$message.error("评价发布失败，" + result.msg);
              }
            })
            .catch(error => {
              this.$message.error("评价发布失败，请稍后再试");
            });
        })
        .catch(() => {
          this.$message.error("评价发布失败，请稍后再试");
        });
      // let rst = await this.$store.dispatch("orders/addCommentsAction", skuMap);
      // if (rst && rst.length > 0) {
      //   this.$message.success({
      //     message: "评价成功",
      //     duration: 1000
      //   });
      // }
    }
  },
  created() {
    this.getPicture = getPicture;
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"


  .nav-bread {
    margin 30px 0 20px
    .active {
      & /deep/ .el-breadcrumb__inner {
        color #0f4511
      }
    }
  }

  .apply-main {
    background #fff
    margin-bottom 20px
    .main {
      padding 30px 20px
      border-bottom 1px #F5F5F5 solid
      .main-child{
        padding 10px 0 0 10px
        overflow hidden
        .flBox{
          float left
          width 280px
          margin-right 10px
          .shop-pic{
            width 180px
            height 180px
            margin 0 auto 30px
            border 1px #E0E0E0 solid
            overflow hidden
          }
          .shop-title{
            color: #222222
            font-size 14px
            line-height 24px
            margin-bottom 10px
          }
          .shop-prize{
            font-size 16px
            color #222
            text-align: center;

          }
        }
        .frBox{
          float left
          .shop-xing{
            overflow hidden
            padding-bottom 22px
            font-size 14px
            color #222
            .shop-xing-name{
              float left
              margin-right 30px
            }
            .text-area{

              width: 584px;
              height: 128px;
              resize: none;

            }
            .el-xing{
              float left
              margin-top 1px
            }
            #pingjia{
              width: 564px;
              height: 128px;
              border: 1px #E0E0E0 solid;
            }
            .shop-shaiPic{
              float left
              .upload-area{
                display: flex;
                /*flex-direction: column;*/
                .upload-slot{
                  display :flex;
                  overflow hidden
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  .image-box{
                    margin-right:20px;
                    position: relative;
                    .delete-icon{
                      position: absolute;
                      right: 0;
                      top: 0;
                      z-index :999;
                    }
                    img{
                      position: relative
                    }
                  }
                  .icon-tips{
                    display: flex;
                    flex-direction: column;

                    align-items: center;
                    justify-content: center;
                    .add-icon{
                      display flex
                      justify-content: center;
                      align-items center
                      width: 80px;
                      height: 80px;
                      color: #ccc;
                      border: 1px dashed #ccc;
                    }
                    .upload-tips{
                      font-size:10px;
                      margin-top: 6px;
                    }
                  }
                }
              }

              .cx-shai{
                color #888888
                font-size 12px
                line-height 28px
                padding-top 15px
              }
            }
            .inTn{
              text-indent 29px
            }
          }
          .shop-xing:last-child{
            padding 0
          }
        }
      }
    }
    .page-title {
      flexCenter()
      font-weight bold
      padding-left 20px
      font-size 16px
      color #222
      height 55px
      border-bottom 1px solid #e0e0e0
    }

    .table-title {
      font-size 16px
      color #222
      margin-bottom 10px
    }
    .table {
      border 1px solid #d7d7d7
    }
    .table-head {
      flexCenter()
      justify-content space-between
      border-bottom 1px solid #e0e0e0
      .head-item {
        font-size 15px
        color #222
        background #f5f5f5
        height 36px
        text-align center
        border-right 1px solid #d7d7d7
        &:last-child {
          border-right none
        }
      }
    }

    .table-item {
      flexCenter()
      /*justify-content space-between*/
      height 120px
      /*padding 20px 0 20px 0*/
      border-bottom 1px solid #e6e6e6
      &:last-child {
        border-bottom none
      }
      .goods-main {
        flexCenter()
        width 400px
        padding 0 30px
        border-right 1px solid #d7d7d7
        height 120px
      }
      .goods-img {
        // border 1px solid #e6e6e6
        wh(72px, 72px)
      }
      .goods-content {
        flexCenter(flex-start, column)
        justify-content space-between
        wh(257px, 72px)
        margin-left 14px
        .goods-title {
          font-size 13px
          color #333
        }

        .goods-type {
          font-size 13px
          color #999
        }
      }
      .goods-send {
        width 240px
        text-align center
        font-size 13px
        color #222
        border-right 1px solid #d7d7d7
        height 120px
        flexCenter()
        justify-content center
      }
      .goods-price {
        flexCenter()
        justify-content center
        font-size 13px
        color #222
        text-align center
        width 140px
        border-right 1px solid #d7d7d7
        height 120px
        &:last-child {
          border-right none
        }
      }
    }

    .form-wrap {
      margin-top 30px
      .form-line {
        flexCenter()
        margin-bottom 14px
        .text-wrap {
          wh(560px, 128px)
        }
        .label {
          margin-right 10px
        }
        .button-list {
          flexCenter()
          .button-item {
            flexCenter()
            justify-content center
            wh(150px, 32px)
            border 1px solid #e0e0e0
            font-size 14px
            color #222
            margin-right 20px
            cursor pointer
            &.active-btn {
              border-color #0f4511
              color #0f4511
            }
          }
        }
      }
    }

  }
  .bottomSub{
    background #fff
    padding 26px 0
    margin-bottom 80px
    .submit-btn {
      wh(200px, 48px)
      background #0f4511
      color #fff
      font-size 16px
      flexCenter()
      justify-content center
      margin 0px auto
      cursor pointer
    }
  }
</style>
