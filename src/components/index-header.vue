<template>
  <div class="main-header">
    <div class="header-top">
      <div class="container">
        <div class="header-left">
          <nuxt-link to="/">
            <img
              style="margin-right: 20px;margin-top: 6px;"
              :src="require('@/assets/images/myPic/logo.gif')"
              width="44px"
            >
          </nuxt-link>
          <span class="text" style="font-size: 0;">
            <label>Hi</label>
            <span class="name">{{user.nickName}}</span>
            <label>你好，欢迎来到仲园拍卖</label>
          </span>
          <div class="search-wrap">
            <input
              type="text"
              class="search-input"
              @keyup.enter="onEnterSerch"
              @focus="onShowSearch"
              @blur="noShowSearch"
              v-model="keyword"
              placeholder="搜索您想要的商品"
            >
            <div class="search-btn" @click="search">
              <i class="el-icon-search"></i>
            </div>
            <div
              class="search-history"
              v-show="onShow || enter"
              @mouseenter="onEnter"
              @mouseleave="noEnter"
            >
              <ul style="position: relative;">
                <li
                  v-for="(item,index) in searchHistoryList"
                  v-if="index<10"
                  @click="onHistorySearch(item)"
                  :key="index"
                >
                  <label>{{item}}</label>
                </li>
              </ul>
              <div class="clear-history" @click="clear()">清除历史</div>
            </div>
          </div>
        </div>

        <div class="header-right">
          <template v-if="isLogin">
            <span class="red" @click="quit">退出</span>
            <span class="sep"></span>
            <nuxt-link to="/personal" class="red" style="color: #888;">我的订单</nuxt-link>
            <span class="sep"></span>
          </template>
          <span class="text">帮助中心</span>
          <span class="sep"></span>
          <span class="text">客服电话：025-58305600(工作日提供服务)</span>
        </div>
      </div>
    </div>

    <div class="main-nav">
      <div class="container">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleClick($event)">
          <el-tab-pane label="首页" name="0"></el-tab-pane>
          <el-tab-pane label="医康养游" name="2"></el-tab-pane>
          <el-tab-pane label="电子商城" name="1"></el-tab-pane>
          <el-tab-pane label="关于我们" name="3"></el-tab-pane>
        </el-tabs>

        <!-- <div class="nav-list">
          <nuxt-link to="/" class="nav-link">首页</nuxt-link>
          <a @click="open('http://trip.gtytong.com/')" class="nav-link">医康养游</a>
          <nuxt-link to="/shop" class="nav-link">电子商城</nuxt-link>
          <nuxt-link to="#" class="nav-link">酒店</nuxt-link>
          <nuxt-link to="#" class="nav-link">会员风采</nuxt-link>
          <nuxt-link to="/about" class="nav-link">关于我们</nuxt-link>
        </div>-->
        <div class="btn-wrap" v-if="!isLogin">
          <nuxt-link to="/login" class="btn-link">登录</nuxt-link>
          <span class="sep"></span>
          <nuxt-link to="/register" class="btn-link">注册</nuxt-link>
        </div>
        <div class="btn-wrap" v-if="isLogin">
          <nuxt-link to="/personal" class="btn-link">个人中心</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import jdAddressSelect from "@/components/jd-address-select";

export default {
  name: "index-header",
  components: {
    jdAddressSelect
  },
  data() {
    return {
      keyword: "",
      city: "",
      showAddrSel: false,
      searchHistoryList: [],
      onShow: false,
      enter: false,
      activeTab: "1"
    };
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    location() {
      return this.$store.state.locationCityforJD;
    },
    locationCity() {
      return this.selectedCity.cityName;
    },
    ...mapGetters("user", ["isLogin"]),
    ...mapGetters(["selectedCity", "selectedCityforJD"]),
    ...mapGetters("address", {
      addressList: "list",
      selectedAddress: "selectedAddress"
    })
  },
  methods: {
    setActiveTab() {
      let path = this.$route.path;
      let type = "";
      if (/^\/$/i.test(path)) type = "0";
      if (/^\/shop\//i.test(path)) type = "1";
      if (/^\/about/i.test(path)) type = "3";
      this.activeTab = type;
      return;
    },
    // 导航
    handleClick(ev) {
      switch (ev.name) {
        case "0":
          this.$router.push({
            path: "/"
          });
          break;
        case "1":
          this.$router.push({
            path: "/serchShop"
          });
          break;
        case "2":
          this.open("http://trip.gtytong.com/");
          break;
        case "3":
          this.$router.push({
            path: "/about"
          });
          break;
      }
    },
    open(url) {
      window.location.href = url;
    },
    handleClose(e) {
      this.showAddrSel = false;
    },
    handleSelected(event) {
      this.$store.commit("update", { selectedCityforJD: event.selected });
      // this.$store.commit("update", { selectedCity: event.selected });
    },
    search() {
      if (this.keyword) {
        //储存到本地
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
            keyword: this.keyword
          }
        }); // 跳转
      }
    },
    // hideSelect(city) {
    //   // this.city = city || this.city;
    //   this.showAddrSel = false;
    //   if (!city) {
    //     return;
    //   }

    //   //todo：后续加上adcode
    //   const selectedCity = {
    //     city: city,
    //     cityCode: 1111,
    //     provinceCode: 111,
    //     areaCode: 1111
    //   };
    //   this.$store.commit("update", { selectedCity: selectedCity });
    // },
    quit() {
      this.$confirm("是否确认退出")
        .then(() => {
          // 清除user数据，跳转至首页
          this.logout().then(() => {
            this.$router.push("/");
          });

          done();
        })
        .catch(() => {});
    },
    ...mapActions("user", ["logout"]),
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
  created() {
    this.setActiveTab();
  },
  mounted() {}
};
</script>

<style lang="stylus">
@import '~assets/mixin.styl';

.main-header {
  .header-top {
    height: 54px;
    border-bottom: 1px solid #E0E0E0;

    .container {
      flexCenter();
      justify-content: space-between;
    }

    .header-left {
      flexCenter();

      label {
        vertical-align: middle;
        font-size: 12px;
      }

      .name {
        font-size: 12px;
        height: inherit;
        display: inline-block;
        max-width: 37px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }
      .local-city {
        font-size: 12px;
        height: inherit;
        display: inline-block;
        max-width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
        white-space: nowrap;
      }
      .logo {
        wh(160px, 54px);
      }

      .text {
        font-size: 12px;
        color: #888;
      }

      .red {
        font-size: 12px;
      }

      .search-wrap {
        flexCenter();
        margin-left: 8px;

        .search-input {
          wh(248px, 28px);
          background: #fff;
          border: 1px solid #D0CCD3;
          border-right: none;
          border-radius: 4px 0 0 4px;
          padding: 0 8px;
          line-height: 28px;
          outline: none;
        }

        .search-btn {
          wh(32px, 28px);
          background: $primary-start;
          font-size: 14px;
          color: #fff;
          text-align: center;
          line-height: 28px;
          cursor: pointer;
          border-radius: 0 4px 4px 0;
        }
      }
    }

    .header-right {
      flexCenter();
      color: #888;
      font-size: 12px;

      .iconfont {
        font-size: 16px;
        margin-left: 14px;
      }
    }

    .search-wrap {
      position: relative;
      flexCenter();
      color: #888;
      font-size: 12px;

      .iconfont {
        font-size: 16px;
        margin-left: 14px;
      }
    }

    .red, .text {
      cursor: pointer;
    }

    .sep {
      width: 1px;
      height: 14px;
      background: #888;
      margin: 0 0.5em;
    }
  }

  .el-tabs__header {
    margin-bottom: 0;
  }

  .el-tabs__item {
    border: none;
    border-bottom: none;
    border-left: none;
    font-size: 16px;

    &:hover {
      color: $primary-start;
    }
  }

  .el-tabs__nav-wrap, .el-tabs--card>.el-tabs__header, .el-tabs--card>.el-tabs__header .el-tabs__item {
    border-bottom: 0;
  }

  .el-tabs__nav-wrap {
    margin-bottom: -3px;
  }

  .el-tabs--card>.el-tabs__header .el-tabs__nav, .el-tabs__nav-wrap, .el-tabs--card>.el-tabs__header .el-tabs__item {
    border: 0;
  }

  .el-tabs__item, .el-tabs--bottom .el-tabs--left .el-tabs__item:nth-child(2), .el-tabs--bottom .el-tabs--right .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--border-card .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--card .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--left .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--right .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--border-card .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--card .el-tabs__item:nth-child(2) {
    padding-left: 30px;
    padding-right: 30px;
  }

  .is-active {
    color: #fff;
    background: $primary-start;
    border-bottom-color: $primary-start;
  }

  .main-nav {
    border-bottom: 2px solid $primary-start;

    .container {
      flexCenter();
      justify-content: space-between;

      .nav-list {
        flexCenter();
        height: 43px;

        .nav-link {
          margin-right: 68px;
          font-size: 16px;
          color: #888;
        }
      }

      .btn-wrap {
        flexCenter();
        wh(110px, 44px);
        background: $primary-start;

        .btn-link {
          flex: 1;
          color: #fff;
          font-size: 16px;
          text-align: center;
        }

        .sep {
          wh(1px, 16px);
          background: #fff;
        }
      }
    }
  }

  .address_warp {
    left: -72px !important;
    top: 27px !important;
  }

  .redcity {

    color: $primary-start;
    font-size: 12px;
    cursor: pointer;
  }

  // .search-history{
  // display: block;
  // top: 36px;
  // width: 280px;
  // background: #fff;
  // position: absolute;
  // z-index: 2000;
  // }
  // .clear-history,.search-history li{
  // width: 100%;
  // height: 22px;
  // padding-left: 10px;
  // color: #000;
  // cursor: pointer;
  // }
  // .search-history li:hover{
  // background-color: #ccc;
  // }
  // .search-history li label{
  // cursor: pointer;
  // }
  // // .search-history li a{
  // //   color: #000;
  // // }
  // .clear-history{
  // cursor:pointer;
  // }
  .search-history {
    display: block;
    top: 36px;
    width: 280px;
    background: #fff;
    position: absolute;
    z-index: 2000;
  }

  .clear-history, .search-history li {
    width: 100%;
    height: 22px;
    padding-left: 10px;
    color: #000;
    cursor: pointer;
  }

  .search-history li:hover {
    background-color: #ccc;
  }

  .search-history li label {
    cursor: pointer;
  }

  .clear-history {
    cursor: pointer;
  }
}
</style>
