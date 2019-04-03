<template>
  <div class="main-search container">
    <div class="logo"><nuxt-link to="/"><img :src="require('@/assets/images/myPic/logo.gif')"  width="90px" /></nuxt-link></div>
    <div class="search-wrap">
      <input type="text" class="search-input" v-model="keyword" @keyup.enter="onEnterSerch" @focus="onShowSearch" @blur="noShowSearch" :class="{hasBorder: hasBorder}" placeholder="请输入想要搜索的内容">
      <div class="search-btn"  @click="search"><i class="el-icon-search"></i></div>
      <div class="search-history" v-show="onShow || enter" @mouseenter="onEnter" @mouseleave="noEnter">
        <ul style="position: relative;">
          <li v-for="(item,index) in searchHistoryList" v-if="index<10" @click="onHistorySearch(item)">
            <label>{{item}}</label>
          </li>
        </ul>
        <div class="clear-history" @click="clear()">清除历史</div>
      </div>
    </div>
    <div v-if="isLogin" class="shop-cart-btn" @click="gotoCart()">
      <span class="car-icon"></span>
      <span class="text" >我的购物车</span>
      <span class="float" v-show="showNumber">{{showNumber}}</span>
    </div>
    <div v-else class="shop-cart-btn" style="background-color: transparent;border: none;"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { cartList } from "@/const/api";

export default {
  name: "main-srarch",
  props: ["hasBorder"],
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
    search() {
      if (this.keyword != "") {
        // this.$router.push({ path: "/serchShop" }); // 跳转
        this.$router.push({
          path: "/serchShop",
          query: {
            keyword: this.keyword,
            page: 1
          }
        }); // 跳转
      }
    },
    gotoCart() {
      this.$router.push({ path: "/cart" });
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
  },
  computed: {
    ...mapGetters("user", ["isLogin"])
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"
  .main-search {
    padding 20px 0 33px
    flexCenter()
    justify-content space-between

    .logo {
      width 102px
      height 50px
      padding-left 100px
    }
    .search-wrap {
      position: relative;
      flexCenter()
      .search-input {
        wh(474px, 38px)
        background #fff
        border none
        padding 0 10px
        line-height 38px
        outline none
        &.hasBorder{
          border 2px solid rgba(252,15,61,1)
        }
      }
      .search-btn {
        width 46px
        height 38px
        background $primary-start
        font-size 22px
        color #fff
        text-align center
        line-height 38px
        cursor pointer
      }
    }
    .shop-cart-btn {
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
      position relative
      flexCenter()
      justify-content center
      width 180px
      height 38px
      background rgba(255, 255, 255, 1)
      border 1px solid rgba(224, 224, 224, 1)
      color #888
      cursor pointer
      transition all linear .2s
      &:hover {
        border-color $primary-start
      }
      .car-icon {
        margin-right 15px
        width 18px
        height 18px
        backImg('~assets/images/shop-car-icon.png')
      }
    }
  }
  .search-history{
    display: block;
    top: 40px;
    left: 0;
    width: 520px;
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
