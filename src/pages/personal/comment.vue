<template>
  <div class="page">
    <div class="myorder-main container">
      <div class="order-main" v-if="currentTab === 1">

        <div class="order-head">
          <div class="head-item" style="width: 310px">商品详情</div>
          <div class="head-item" style="width: 125px;">评价内容</div>
          <div class="head-item" style="width: 120px">晒图</div>
        </div>
        <div class="empty-box" v-if="isEmpty">暂无数据</div>

        <div class="order-section" v-for="(pItem, index) in commentList" :key="index">
          <div class="order-list">
            <div class="goods-list">
              <div class="goods-item">
                <div class="goods-main">
                  <div class="goods-img">
                    <nuxt-link class="href-class" :to="{path:'/detail', query:{id:pItem.goodid}}"><img v-bind:src="getPicture+pItem.pic1" width="72" height="72"></nuxt-link>
                  </div>
                  <div class="goods-content">
                    <div class="goods-title">
                      <nuxt-link class="href-class" :to="{path:'/detail', query:{id:pItem.goodid}}">{{pItem.name}}</nuxt-link>
                    </div>
                    <!--<div class="title-point" v-show="pItem.name && pItem.name.length>56">...</div>-->
                    <!--<div class="goods-type">{{pItem.propItem}}</div>-->
                  </div>
                </div>
                <div class="goods-price">{{pItem.price | price}}</div>
              </div>
            </div>
            <div class="order-item-box">
              <div class="text" style="width: 100%;">{{pItem.commentContent}}</div>
            </div>
            <div class="order-item-box">
              <viewer v-if="pItem.commentPic1"
                      :height="'60px'" :width="'60px'" :src="getPicture+'5cb2fb1a88ccd.png'"/>
              <viewer class="view" v-if="pItem.commentPic2"
                      :height="'60px'" :width="'60px'" :src="getPicture+pItem.commentPic2"/>
              <viewer class="view" v-if="pItem.commentPic3"
                      :height="'60px'" :width="'60px'" :src="getPicture+pItem.commentPic3"/>
            </div>
          </div>
        </div>
        <div class="page-wrap">
          <el-pagination
            @current-change="getMyComment"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderDetail, tripBaseUrl } from "@/const/path";
import {
  goodsDetail,
  addCart,
  getTourismOrderList,
  getOrderList,
  getPicture,
  getCommentList
} from "@/const/api";
import { resolveImg } from "@/utils";
import Viewer from "viewer";
console.log(Viewer);
export default {
  name: "commentList",
  layout: "personal-layout",
  components: {
    viewer: Viewer
  },
  data() {
    return {
      activeTab: 0,
      currentPage: 1,
      commentList: [],
      total: 0,
      pageSize: 10,
      isEmpty: false,
      healthCaresEmpty: false,
      currentTab: 1,
      healthCaresList: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    }
  },
  mounted() {
    this.getMyComment();
  },
  methods: {
    async getMyComment() {
      //type,code,mobile,password
      let data = {
        page: this.currentPage,
        pageSize: 5
      };
      const rst = await this.$axios.$get(
        `${getCommentList}?userid=${this.user}`
      );
      console.log(12345, rst);
      this.commentList = rst;
      this.total = rst.total;
      this.pageSize = rst.pageSize;
      if (!this.commentList || !this.commentList.length)
        return (this.isEmpty = true);
      this.isEmpty = false;
    }
  },
  created() {
    this.getPicture = getPicture;
  }
};
</script>

<style scoped lang="stylus">
  @import '~assets/mixin.styl';

  .page {
    .segments {
      display: flex;
      cursor: pointer;
      background: #fff;
      height: 55px;

      .segment {
        width: 108px;
        padding: 5px;
        text-align: center;
        font-size: 15px;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
        line-height: 45px;
      }

      .segment-selected {
        color: #0f4511;
      }
    }
  }

  .myorder-main {
    flexCenter(flex-start);
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .order-main {
    wh(1000px, auto);
    padding: 20px 20px;
    background: #fff;

    .order-nav {
      flexCenter();

      .nav-item {
        color: #666;
        font-size: 15px;
        padding-bottom: 5px;
        border-bottom: 3px solid transparent;
        margin-right: 35px;
        width: 4em;
        cursor: pointer;
        text-align: center;

        &.active {
          color: #0f4511;
          border-color: #0f4511;
        }
      }
    }

    .order-head {
      flexCenter();
      justify-content: space-between;
      padding: 0 20px;
      background: #f5f5f5;
      border: 1px solid #e6e6e6;
      height: 40px;

      .head-item {
        font-size: 13px;
        color: #333;
        text-align: center;
      }
    }

    .order-section {

      .section-head {
        flexCenter();
        justify-content: space-between;
        padding: 0 20px;
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        height: 36px;

        .head-left {
          flexCenter();

          .text {
            width: 100%!important
            font-size: 13px;
            color: #999;
            margin-right: 40px;
          }

          .desc {
            color: #1a1a1a;
          }
        }

        .head-right {
          font-size: 12px;
          color: #999;
          width: 264px;
        }
      }

      .list-head {
        flexCenter();
        padding: 0 20px;
        border: 1px solid #e6e6e6;
        border-top: none;
        height: 36px;
        background: #fff;

        .text {
          font-size: 13px;
          color: #999;
          margin-right: 40px;
        }

        .desc {
          color: #1a1a1a;
        }

        .float {
          wh(60px, 18px);
          flexCenter();
          justify-content: center;
          color: #B3B3B3;
          border: 1px solid #ccc;
          font-size: 12px;
          margin-left: 20px;
        }
      }

      .order-list {
        border: 1px solid #e6e6e6;
        border-top: none;
        flexCenter(normal);
        overflow: hidden;

        .goods-item {
          flexCenter();
          justify-content: space-between;
          wh(450px, 112px);
          padding: 20px 0px 20px 0;
          border-bottom: 1px solid #e6e6e6;
          border-right: 1px solid #e6e6e6;

          &:last-child {
            border-bottom: none;
          }

          .goods-main {
            flexCenter();
            width: 324px;
          }

          .goods-img {
            // border 1px solid #e6e6e6
            margin-left: 16px;
            height: 72px;
          }

          .goods-content {
            flexCenter(flex-start, column);
            justify-content: space-between;
            wh(292px, 72px);
            margin-left: 14px;
            position: relative;
            .goods-title{
              font-size: 13px;
              color: #333;
              height: 40px;
              overflow: hidden;
              width: 100%;
            }

            .goods-type {
              font-size: 13px;
              color: #999;
            }
          }

          .goods-price {
            font-size: 13px;
            color: #666;
            text-align: center;
            width: 200px;
            margin-left: 14px;
          }

          .goods-num {
            font-size: 13px;
            color: #333;
            width: 200px;
            text-align: center;
          }
        }

        .order-item-box {
          width: 100%;
          text-align: center;
          border-right: 1px solid #e6e6e6;
          padding-top: 18px;
          display: flex;
          &:last-child {
            border-right: none;
          }
        }

        .order-item2-box {
          width: 150px;
          text-align: center;
          border-right: 1px solid #e6e6e6;
          padding-top: 20px;

          &:last-child {
            border-right: none;
          }
        }

        .href-class {
          color: #999;
        }
      }
    }

    .page-wrap {
      margin: 30px 0 0;
      text-align: right;
    }
  }

  .href-class:hover {
    color: #0f4511 !important;
  }

  .empty-box {
    width: 960px;
    height: 150px;
    text-align: center;
    vertical-align: middle;
    line-height: 150px;
    font-size: 16px;
    border: 1px solid #e6e6e6;
  }
  .title-point {
    position: absolute
    right: -10px;
    top: 20px;
    color: #999;
  }
</style>
