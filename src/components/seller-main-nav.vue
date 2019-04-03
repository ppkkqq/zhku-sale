<template>
  <div class="user-main-nav">
    <div class="container">
      <div class="nav-left">
        <div class="logo">
          <img class="nav-logo" :src="require('@/assets/images/myPic/logo.gif')" width="60px" />
        </div>
        <div class="page-title" @click="gotoMemberCenter()">店铺中心</div>
        <div class="nav-list">
          <nuxt-link to="/" class="nav-link" exact>首页</nuxt-link>
        </div>
      </div>

      <div class="nav-right">
        <div class="search-wrap">
          <input type="text" class="search-input" @keyup.enter="onEnterSerch" @focus="onShowSearch" @blur="noShowSearch" v-model="keyword" placeholder="请输入想要搜索的内容">
          <div class="search-btn" @click="search"><i class="el-icon-search"></i></div>
          <div class="search-history" v-show="onShow || enter" @mouseenter="onEnter" @mouseleave="noEnter">
            <ul style="position: relative;">
              <li v-for="(item,index) in searchHistoryList" v-if="index<10" @click="onHistorySearch(item)">
                <label>{{item}}</label>
              </li>
            </ul>
            <div class="clear-history" @click="clear()">清除历史</div>
          </div>
        </div>
        <nuxt-link to="/cart" tag="div" class="shop-cart-btn">
          <span class="car-icon"></span>
          <span class="text">我的购物车</span>
          <span class="float" v-show="showNumber">{{showNumber}}</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from "vuex";
  import { cartList } from "@/const/api";
  export default {
    name: "seller-main-nav",
    data() {
      return {
        keyword: "",
        searchHistoryList: [],
        onShow: false,
        enter: false,
        showNumber: ""
      };
    },
    methods: {
      ...mapActions("cart", ["productCount"]),
      gotoMemberCenter() {
        this.$router.push({ path: "/seller" });
      },
      search() {
        if (this.keyword) {
          const storage = localStorage;
          if (storage) {
            const searchHistoryStr =
              storage.getItem("searchHistory") || JSON.stringify([]);
            this.searchHistoryList = JSON.parse(searchHistoryStr);
            this.searchHistoryList.unshift(this.keyword);
            storage.setItem(
              "searchHistory",
              JSON.stringify(this.searchHistoryList)
            );
          }
          this.$router.push({
            path: "/serchShop",
            query: {
              keyword: this.keyword,
              page: 1
            }
          }); // 跳转
        }
      },
      onShowSearch() {
        if (localStorage.searchHistory) {
          this.searchHistoryList = this.unique(
            JSON.parse(localStorage.searchHistory)
          );
          this.onShow = true;
        }
      },
      noShowSearch() {
        this.onShow = false;
      },
      onEnter() {
        this.enter = true;
      },
      noEnter() {
        this.enter = false;
      },
      clear() {
        localStorage.clear();
        this.searchHistoryList = [];
      },
      onHistorySearch(item) {
        this.keyword = item;
        this.search();
        this.noEnter();
      },
      onEnterSerch() {
        this.noShowSearch();
        this.search();
      },
      unique(arr) {
        //数组去重
        var newArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
          if (arr.indexOf(arr[i]) == i && arr[i]) {
            newArr.push(arr[i]);
          }
        }
        return newArr;
      }
    },
    async mounted() {
      this.showNumber = await this.productCount();
    }
  };
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"

  .user-main-nav {
    height 88px
    background #0f4511

    .container {
      flexCenter()
      justify-content space-between
      height 88px
    }

    .nav-left {
      height 100%
      flexCenter()
      .logo {
        wh(80px, 80px)
        .nav-logo {
          wh(80px, 80px)
          margin-right 26px
        }
      }
      .page-title {
        font-size 20px
        color #fff
        margin-left 26px
        cursor pointer
      }
      .nav-list {
        height 100%
        flexCenter()
        margin-left 80px
        .nav-link {
          box-sizing: border-box;
          padding 0 20px
          height 100%
          text-align center
          line-height 88px
          font-size 16px
          color #fff
          margin-right 57px
          opacity .8
          &.active {
            opacity 1
          }
          &.nuxt-link-active {
            color #fff !important
            background #0f4511
            font-weight 800
            opacity 1
          }
        }
      }
    }

    .nav-right {
      flexCenter()
      .search-wrap {
        position: relative;
        flexCenter()
        .search-input {
          wh(234px, 38px)
          padding 0 10px
          line-height 38px
          outline none
          border 1px solid #fff
        }
        .search-btn {
          width 46px
          height 38px
          background #0f4511
          font-size 22px
          color #fff
          text-align center
          line-height 38px
          cursor pointer
        }
      }
      .shop-cart-btn {
        flexCenter()
        justify-content center
        width 160px
        height 38px
        background rgba(255, 255, 255, 1)
        border 1px solid rgba(224, 224, 224, 1)
        color #888
        cursor pointer
        transition all linear .2s
        margin-left 20px
        position relative
        .float {
          position absolute
          wh(25px, 16px)
          border-radius 8px 8px 8px 0
          background #0f4511
          font-size 12px
          color #fff
          text-align center
          line-height 16px
          right 2px
          top 4px
        }
        .car-icon {
          margin-right 15px
          width 18px
          height 18px
          backImg('~assets/images/shop-car-icon.png')
        }
      }
    }
  }
  .search-history{
    display: block;
    top: 39px;
    left: 0;
    width: 280px;
    background: #fff;
    position: absolute;
    z-index: 2000;
  }
  .clear-history,.search-history li{
    width: 100%;
    height: 22px;
    padding-left: 10px;
    color: #000;
    cursor: pointer;
  }
  .search-history li:hover{
    background-color: #ccc;
  }
  .search-history li label{
    cursor: pointer;
  }
  .clear-history{
    cursor:pointer;
  }
</style>
