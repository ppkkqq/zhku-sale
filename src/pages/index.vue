<template>
  <div class="page-main">
    <index-header></index-header>

    <main-search></main-search>

    <div class="nav-wrap container">
      <div class="type-wrap" @mouseleave="typeShowIndex = -1">
        <div class="type-title">全部商品分类</div>
        <ul class="type-list">
          <li
            class="type-item"
            :class="{'type-item-on': typeShowIndex === index}"
            v-for="(item, index) in categary"
            :key="index"
            @click="go2SearchByType(item)"
          >
            <span class="float-line"></span>
            <span class="type-link">{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="banner-wrap">
        <ul class="nav-list">
          <li class="nav-item">
            <nuxt-link to="/" class="nav-link">首页</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link to="/serchShop?day=today&page=1" class="nav-link">今日拍卖</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link to="/serchShop?day=tomorrow&page=1" class="nav-link">明日拍卖</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link to="/personal/jingjiajilu" class="nav-link">我的拍卖</nuxt-link>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link">帮助中心</a>
          </li>
        </ul>

        <div class="banner-box">
          <el-carousel arrow="never" trigger="click" height="328px">
            <el-carousel-item>
              <img :src="require('@/assets/images/myPic/zk2.jpg')" width="100%" height="328">
            </el-carousel-item>
            <el-carousel-item>
              <img :src="require('@/assets/images/myPic/zk1.jpg')" width="100%" height="328">
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>

    <div class="goods-wrap container">
      <div class="goods-list characteristic-list">
        <div class="list-one">
          <img :src="require('@/assets/images/myPic/indexPic1.jpg')" class="one-cover">
          <div class="mask">
            <div class="title">
              精品推荐
              <i class="el-icon-arrow-right"></i>
            </div>
            <nuxt-link :to="{ path: '/serchShop', query: { day: 'today',page: 1}}" class="desc">拍卖现场 火热进行中</nuxt-link>
          </div>
        </div>
        <div
          class="list-item"
          v-for="(item, index) in recommendList['today']"
          v-if="index < 5 && item.name && item.price"
          :key="index"
          @click="detailLink(item)"
        >
          <img :src="getPicture+item.pic1" class="good-cover">
          <div class="characteristic-msg">
            <div class="title">{{item.name}}</div>
            <div class="desc">{{item.content}}</div>
            <div class="price red">¥{{item.price}}</div>
          </div>
        </div>
      </div>

      <div class="goods-list">
        <div
          class="goods-nav"
          :style="{background: colorList[1], borderTop: '1px solid ' + colorList[1]}"
        >
          <div class="nav-title">
            <div class="nav-title-font">明日预告</div></div>
            <nuxt-link
              :to="{ path: '/serchShop', query: { day: 'tomorrow',page: 1}}"
              class="more-link"
            >查看更多</nuxt-link>
        </div>
        <div class="push-list" >
          <nuxt-link
            class="list-item"
            v-for="(item,index) in recommendList['tomorrow']"
            :key="index"
            v-if="item && item.name && index < 5"
            :to="{ path: '/detail', query: { id: item.goodid}}"
          >
            <img :src="getPicture+item.pic1" class="good-cover">
            <div class="goods-msg">
              <div class="title">{{item.name}}</div>
              <div class="desc">{{item.content}}</div>
              <div class="price red">{{item.price | price}}</div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="goods-list">
        <div
          class="goods-nav"
          :style="{background: colorList[2], borderTop: '1px solid ' + colorList[2]}"
        >
          <div class="nav-title">
            <div class="nav-title-font">后天预告</div></div>
          <nuxt-link
            :to="{ path: '/serchShop', query: { day: 'day3',page: 1}}"
            class="more-link"
          >查看更多</nuxt-link>
        </div>
        <div class="push-list" >
          <nuxt-link
            class="list-item"
            v-for="(item,index) in recommendList['day3']"
            :key="index"
            v-if="item && item.name && index < 5"
            :to="{ path: '/detail', query: { id: item.goodid}}"
          >
            <img :src="getPicture+item.pic1" class="good-cover">
            <div class="goods-msg">
              <div class="title">{{item.name}}</div>
              <div class="desc">{{item.content}}</div>
              <div class="price red">{{item.price | price}}</div>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
  import indexHeader from "@/components/shop-header";
  import mainSearch from "@/components/main-search";
  import indexFooter from "@/components/shop-footer";
  import { getRecommendList,getPicture } from "@/const/api";
  import { confirmOrder } from "../const/path";
  export default {
    components: {
      indexHeader,
      mainSearch,
      indexFooter
    },
    data() {
      return {
        banner: [
          {
            src: require("@/assets/images/shop-index-banner.png")
          }
        ],
        colorList: [
          "#0f4511",
          "#0f4511",
          "#0f4511"
        ],
        recommendList: {'today': [],'tomorrow': [],'day3': []},
        tomorrowDatas: [],
        daysDatas: [],
        categary: ['鞋靴', '配件', '学习用品','衣服','休闲零食','家居用品','手机配件','电脑硬件'],
        typeShowIndex: -1,
        floors: []
      };
    },

    methods: {
      go2SearchByType(item) {
        this.$router.push({
          path: "/serchShop",
          query: {
            type: item
          }
        });
      },
      async getRecommendList(day) {
        let rst = await this.$axios.$get(`${getRecommendList}?day=${day}`);
        if (rst != "") {
          this.recommendList[day] = rst;
        } else {
          this.$message({
            showClose: true,
            message: "获取推荐列表失败，请稍后再试"
          });
        }
      },
      detailLink(item) {
        this.$router.push({
          path: "/detail",
          query: {
            id: item.goodid
          }
        });
      }
    },
    mounted() {
      this.getRecommendList('today');
      this.getRecommendList('tomorrow');
      this.getRecommendList('day3');
      this.getPicture = getPicture;
    }
  };
</script>

<style lang="stylus">
  @import '~assets/mixin.styl';

  .nav-wrap {
    flexCenter();
    justify-content: space-between;
  }

  .nav-wrap {
    flexCenter(flex-start);
    justify-content: space-between;
    .type-list {
      height: 328px;
      overflow: auto;
    }
    .type-wrap {
      position: relative;
      width: 196px;

      .type-title {
        background: #0f4511;
        color: #fff;
        font-size: 16px;
        padding-left: 20px;
        line-height: 40px;
        wh(196px, 40px);
      }

      .type-item {
        position: relative;
        flexCenter();
        justify-content: center;
        background: #222;
        wh(196px, 41px);
        line-height: 41px;
        text-align: center;
        font-size: 14px;
        transition: all linear 0.1s;
        cursor: pointer;
        &.type-item-on {
          background: #fff;

          .float-line {
            display: block;
          }

          .type-link {
            color: #222;
          }
        }

        .float-line {
          position: absolute;
          display: none;
          left: 16px;
          top: 13px;
          wh(4px, 15px);
          background: #0f4511;
        }

        .type-link {
          color: #fff;

          &:after {
            content: '/';
            margin: 0 0.3em;
          }

          &:last-child:after {
            display: none;
          }
        }
      }
    }

    .type-content {
      position: absolute;
      left: 196px;
      top: 40px;
      wh(808px, auto);
      min-height: 369px;
      background: #fff;
      border: 1px solid #222;
      border-left: none;
      padding: 40px;
      z-index: 1000;

      .content-item {
        flexCenter(flex-start);
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .title {
          width: 75px;
          font-size: 14px;
          color: #222;
          font-weight: bold;

          i {
            color: #222;
            font-weight: bold;
          }
        }

        .content-list {
          flexCenter();
          flex-wrap: wrap;
          margin-left: 28px;
          flex: 1;
          padding-bottom: 16px;
          border-bottom: 1px solid #D7D7D7;

          .list-item {
            margin-right: 14px;

            .item-link {
              font-size: 12px;
              color: #222;

              &:hover {
                color: #0f4511;
              }
            }
          }
        }
      }
    }

    .banner-wrap {
      width: 984px;

      .nav-list {
        flexCenter();
        height: 40px;
        line-height: 40px;

        .nav-item {
          margin-right: 40px;

          .nav-link {
            color: #222;
            font-size: 16px;
          }
        }
      }

      .banner-box {
        wh(984px, 326px);
        background: #7f828b;
      }
    }
  }

  .goods-wrap {
    margin-bottom: 100px;

    .characteristic-list {
      flexCenter(flex-start);
    }

    .goods-list {
      margin-top: 30px;
      width: 1200px;

      .goods-nav {
        flexCenter();

        .nav-title {
          flex-basis: 196px;

          height: 44px;
          line-height: 44px;
          color: #fff;
          .nav-title-font{
            padding-left: 24px;
          }
        }

        .nav-main {
          flex: 1;
          flexCenter();
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.9);
          height: 44px;

          .nav-content {
            flexCenter();

            .nav-content-item {
              flexCenter();

              &:last-child {
                .sep {
                  display: none;
                }
              }

              .nav-link {
                font-size: 14px;
                color: #888;
                padding: 0 20px;
                cursor: pointer;
              }

              .sep {
                wh(1px, 14px);
                background: #c2c2c2;
              }
            }
          }
        }
      }

      .push-list {
        flexCenter();
      }

      .list-one {
        wh(196px, 288px);
        position: relative;

        .one-cover {
          position: absolute;
          top: 0;
          left: 0;
          wh(100%, 100%);
          z-index: -1;
        }

        .mask {
          padding: 20px;
          // background rgba(0, 0, 0, .3)
          wh(196px, 100%);
        }

        .title {
          color: #fff;
          font-size: 24px;
          font-weight: 600;
        }

        .desc {
          font-size: 16px;
          color: #fff;
          margin-top: 10px;
          font-weight: 300;
        }
      }

      .list-item {
        wh(200px, 288px);
        position: relative;
        background: #fff;
        margin-right: 1px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }

        .good-cover {
          wh(164px, 164px);
          margin: 20px 18px;
          z-index: -1;
          display: block;
        }

        .characteristic-msg {
          padding: 8px 17px 0;

          .title {
            color: #222;
            font-size: 16px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }

        .goods-msg {
          padding: 2px 18px 8px;

          .title {
            color: #444;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .price {
            font-size: 16px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
  .desc {
    color: #666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .more-link {
    font-size: 12px;
    color: #888;
    margin-right: 22px;
  }
</style>
