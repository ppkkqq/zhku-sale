<template>
  <div class="page">
    <div class="container" style="width: 1032px">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="nav-bread">
        <el-breadcrumb-item to="/personal">个人中心</el-breadcrumb-item>
        <el-breadcrumb-item to="/personal/#">我的订单</el-breadcrumb-item>
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
                  <div class="shop-xing-name">商品评分</div>

                  <el-rate class="el-xing"
                           v-model="score"
                           :colors="['#99A9BF', '#F7BA2A', '#F7BA2A']">
                  </el-rate>
                </div>
                <div class="shop-xing">
                  <div class="shop-xing-name">商品评价</div>
                  <textarea class="text-area" v-model="content"></textarea>
                </div>
                <form class="form-horizontal templatemo-create-account templatemo-container" role="form"
                      :action="addCommentPic" method="post" enctype="multipart/form-data" @submit.prevent="submitPic">
                <div class="shop-xing">
                  <div class="shop-xing-name inTn">晒单</div>
                  <div class="shop-shaiPic">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :action="123"
                      :multiple="multiple"
                      :on-change="handleChange"
                      :on-remove="handleRemove"
                      :file-list="imageList"
                      list-type="picture">
                      <input type="file" required="required" name="pic[]" accept="image/*" multiple style="cursor: pointer;">
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    <p class="cx-shai">最多可上传3张图片，每张图片大小不超过5M，支持bmp,gif,jpg,png,jpeg格式文件</p>
                    <input type="submit" value="提交" class="submit-pic">
                  </div>
                </div>
                </form>
              </div>
          </div>
        </div>
      </div>
      <!--<div class="bottomSub">-->
        <!--<div class="submit-btn" @click="addComments">提交</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import upload from "@/components/upload";
import { addComments, updateOrderStatusCommented,getOrderDetail,getPicture,newComment,addCommentPic } from "@/const/api";

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
      score: "",
      content: "",
      imageList: [],
      url: "",
      picList: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    }
  },
  mounted() {
    if (!this.user) {
      this.$router.push({ path: '/login' })
    }
    if (!this.$route.params || !this.$route.params.id) {
      return;
    }
    this.getMyOrderDetail();
    // this.getComments();
    this.addCommentPic = addCommentPic;
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageList = fileList
    },
    handleChange(file, fileList) {
      this.imageList = fileList
    },
    async getMyOrderDetail() {
      let rst = await this.$axios.$get(`${getOrderDetail}?user=${this.user}&goodid=${this.$route.params.id}`);
      this.orderDetail = rst;
    },
    //上传图片
    submitPic(event) {
      if (!this.orderDetail) {
        return;
      }
      if (!this.score || !this.content) {
        this.$message("内容不能为空");
        return;
      }
      this.$confirm(`您确认发表该评价吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formData = new FormData(event.target);
        this.$axios.$post(addCommentPic, formData)
          .then(res => {
            if (res == 'error') {
              this.$message.error("图片上传失败，请稍后再试");
              return false
            } else {
              this.picList = res
              this.addComments()
            }
          })
      })
        return false
  },
  async addComments() {
      this.$axios.$post(newComment, {
        user: this.user,
        goodid: this.$route.params.id,
        score: this.score,
        content: this.content,
        images: this.picList
      })
        .then(res => {
          if (res == 'success') {
            this.$message.success("评价发布成功");
            this.$router.push({ path: "/personal" })
          }else{
            this.$message.error("评价发布失败，请稍后再试");
          }
        })
      .catch(() => {
      })
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
  .submit-pic{
    display: inline-block;
    margin-top: 10px;
    padding: 10px 40px;
    background-color: #67c23a;
    color: #fff;
    border: 0;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
