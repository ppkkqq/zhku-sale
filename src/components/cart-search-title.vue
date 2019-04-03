<template>
  <div class="cart-search-wrap container">
    <div class="logo-wrap">
      <div class="logo">
      	<nuxt-link to="/" ><img :src="require('@/assets/images/myPic/logo.gif')" width="80px" /></nuxt-link>
      </div>
      <div class="title" v-if="title">{{title}}</div>
    </div>

    <div class="search-wrap">
      <input type="text" class="search-input"  @keyup.enter="onEnterSerch" @focus="onShowSearch" @blur="noShowSearch" v-model="keyword" placeholder="请输入想要搜索的内容">
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
  </div>
</template>

<script>
export default {
  name: "cart-search-title",
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      keyword: "",
      searchHistoryList: [],
      onShow: false,
      enter: false
    };
  },
  methods: {
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
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"

  .cart-search-wrap {
    flexCenter()
    justify-content space-between
    padding 20px 0 40px 0
    .logo-wrap {
      flexCenter()
      .logo{
        margin-left: 50px;
        width: 110px;
        height: 36px;
        background-color: #fff;
      }
      .title {
        font-size 20px
        color #666
        margin-left 30px
        font-weight 500
      }
    }
    .search-wrap {
      position: relative;
      flexCenter()
      .search-input {
        wh(262px, 32px)
        background #fff
        padding 0 10px
        line-height 32px
        outline none
        border 2px solid #0f4511
      }
      .search-btn {
        wh(38px, 32px)
        background #0f4511
        font-size 20px
        color #fff
        text-align center
        line-height 32px
        cursor pointer
      }
    }
  }
  .search-history{
    display: block;
    top: 34px;
    left: 0;
    width: 300px;
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
