<template>
  <div class="page bgf search-goods">
    <index-header></index-header>
    <div class="main-search container">
      <div class="logo"><nuxt-link to="/"><img :src="require('@/assets/images/myPic/logo.gif')" width="80px" /></nuxt-link></div>
      <div class="search-wrap" v-if="isSearchCenter">
        <input type="text" class="search-input" v-model="searchParams.search" @keyup.enter="onEnterSearch()" @focus="onShowSearch" @blur="noShowSearch" placeholder="请输入想要搜索的内容">
        <div class="search-btn" @click="onButtonSearch()"><i class="el-icon-search"></i></div>
        <div class="search-history" v-show="onShow || enter" @mouseenter="onEnter" @mouseleave="noEnter">
          <ul style="position: relative;">
            <li v-for="(item, index) in searchHistoryList" v-if="index<10" @click="onHistorySearch(item)">
              <label>{{item}}</label>
            </li>
          </ul>
          <div class="clear-history" @click="clear()">清除历史</div>
        </div>
      </div>
      <div class="shop-cart-btn" @click="gotoCart()">
        <span class="car-icon"></span>
        <span class="text">我的购物车</span>
        <span class="float" v-show="showNumber">{{showNumber}}</span>
      </div>
    </div>

    <div class="navList">
      <ul class="navList-box">
        <li><nuxt-link to="/" class="nav-link">首页</nuxt-link></li>
        <li><nuxt-link to="/serchShop?day=today&page=1" class="activeA nav-link">电子商城</nuxt-link></li>
        <li><nuxt-link to="/about" class="nav-link">关于我们</nuxt-link></li>
      </ul>
    </div>
    <div class="result">
      <div class="result-title">
        <div class="result-eait fl" v-if="isSearchCenter">
          <span style="background-color:#0f4511;color: #fff;padding: 4px 10px;">拍卖时间</span>
          <div v-for="(item, index) in filterOpts"
               :key="index"
               @click="goFilter(item)"
               style="margin-top: 4px;"

          >
            <span style="padding: 6px 10px 2px 10px;cursor: pointer;">{{item}}</span>
          </div>

        </div>

        <div class="result-show fr">
          <p class="mini-amount">共<span> {{goodsNum}} </span>件商品</p>
        </div>
      </div>
    </div>

    <div class="resultAll">
      <ul class="resultAll-ul">

        <li v-for="(item, index) in goodsList" :key="index">
          <div class="thisBox">
            <nuxt-link  :to="{path:'/detail',query:{id:item.goodid}}" class="toXiUrl"><img class="fixPic" :src="getPicture+item.pic1"/></nuxt-link>
            <h3>
              <span></span>{{item.price | price}}
            </h3>
            <nuxt-link  :to="{path:'/detail',query:{id:item.goodid}}" ><span class="goods-name">{{item.name}}</span></nuxt-link>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottomPages">
      <div class="shutPages">确定</div>
      <el-pagination class="el-pages-box"
                     @prev-click="goPrePage"
                     @next-click="goNextPage"
                     :current-page="currentPage"
                     layout=" prev, pager, next,total, jumper"
                     :total="goodsNum"
                     background>
      </el-pagination>
    </div>

    <index-footer></index-footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import indexHeader from "@/components/shop-header";
import searchPanel from "@/components/search-panel";
import mainSearchKx from "@/components/main-search-Kx";
import cartSearchTitle from "@/components/cart-search-title";
import { cartList, searchGoodsList, getPicture } from "@/const/api";
import indexFooter from "@/components/shop-footer";

export default {
  name: "serchShop",
  components: {
    indexHeader,
    searchPanel,
    cartSearchTitle,
    mainSearchKx,
    indexFooter
  },
  data() {
    return {
      query: this.$route.query,
      payType: "1",
      goodsNum: 0, //总商品数
      pageNumAll: 0, //总页数
      currentPage: 1,
      searchParams: {
        page: 1, //第几页,默认为1
        // size: 10, //每页显示数据条数，默认10
        sort: "", //排序方式
        // catalogId: "", //类目id
        search: "", //商品名
        batchId: "", //源通币id
        type: "" //商品类目
      },
      goodsList: [],
      filterOpts: ["不限", "正在进行", "即将开始", "最近3天"],
      selectedFilter: "composite",
      sortStatus: 0,
      searchHistoryList: [],
      onShow: false,
      enter: false,
      showNumber: "",
      breadcrumbBase: { path: "/shop", name: "全部分类" },
      panel: [],
      isReset: false // 重置搜索面板状态
    };
  },
  created() {
    this.Math = Math;
    this.getPicture = getPicture;
  },
  mounted() {
    const { cateId, keyword, type } = this.$route.query;
    this.searchParams.search = keyword;
    this.searchParams.type = type;
    // this.searchParams.catalogId = cateId;
    // this.searchOutline();
    this.getCart();
    this.search();
  },
  computed: {
    //是否是走搜索中心的接口
    isSearchCenter() {
      return !(this.query.markingId || this.query.batchId);
    },
    canSelectPre() {
      // 当前页并非第一页的时候 可以选择上一页
      return this.currentPage != 1;
    },
    canSelectNext() {
      return this.currentPage != this.goodsNum / 10;
    }
  },
  methods: {
    goFilter(v) {
      let queryObj = {};
      this.currentPage = 1;
      switch (v) {
        case "不限":
          queryObj = { day: "all" };
          break;
        case "正在进行":
          queryObj = { day: "today" };
          break;
        case "即将开始":
          queryObj = { day: "tomorrow" };
          break;
        case "最近3天":
          queryObj = { day: "day3" };
          break;
      }
      this.search(queryObj);
    },
    handleCurrentChange(val) {
      this.searchParams.page = val;
      // this.searchParams.catalogId = this.query.cateId;
      this.search();
    },
    gotoCart() {
      this.$router.push({ path: "/cart" });
    },
    onButtonSearch() {
      if (!this.searchParams.search || !this.searchParams.search.trim()) return;
      this.$router.replace({
        path: this.$route.path,
        query: {
          keyword: this.searchParams.search,
          page: this.currentPage
        }
      });
      // 重置面板，等待事件selected通知后搜索
      this.isReset = true;
      this.searchParams.page = 1;
      this.search(); //无面板时需要
    },
    onHistorySearch(item) {
      this.searchParams.search = item;
      this.$router.replace({
        path: this.$route.path,
        query: {
          keyword: item,
          page: this.currentPage
        }
      });
      this.noEnter();
      // 重置面板，等待事件selected通知后搜索
      this.isReset = true;
      this.searchParams.page = 1;
      this.search(); //无面板时需要
    },
    onEnterSearch() {
      //解决在文本框回车不失去焦点的情况
      if (!this.searchParams.search || !this.searchParams.search.trim()) return;
      this.$router.replace({
        path: this.$route.path,
        query: {
          keyword: this.searchParams.search,
          page: this.currentPage
        }
      });
      this.noShowSearch();
      // 重置面板，等待事件selected通知后搜索
      this.isReset = true;
      this.searchParams.page = 1;
      this.search(); //无面板时需要
    },
    async search(queryObj) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading"
      });
      const storage = localStorage;
      // 存入本地
      if (storage && this.searchParams.search) {
        const searchHistoryStr =
          storage.getItem("searchHistory") || JSON.stringify([]);
        this.searchHistoryList = JSON.parse(searchHistoryStr);
        this.searchHistoryList.unshift(this.searchParams.search);
        storage.setItem(
          "searchHistory",
          JSON.stringify(this.searchHistoryList)
        );
      }
      try {
        let rst;
        if (!this.$route.query.keyword && this.$route.query.type && !queryObj) {
          rst = await this.$axios.$get(
            `${searchGoodsList}?type=${this.$route.query.type}&day=all&page=${
              this.currentPage
            }`
          );
        } else if (
          !this.$route.query.keyword &&
          this.$route.query.type &&
          queryObj
        ) {
          rst = await this.$axios.$get(
            `${searchGoodsList}?type=${this.$route.query.type}&day=${
              queryObj["day"]
            }&page=${this.currentPage}`
          );
        } else if (
          this.$route.query.keyword &&
          !this.$route.query.type &&
          !queryObj
        ) {
          rst = await this.$axios.$get(
            `${searchGoodsList}?keyword=${
              this.$route.query.keyword
            }&day=all&page=${this.currentPage}`
          );
        } else if (
          this.$route.query.keyword &&
          !this.$route.query.type &&
          queryObj
        ) {
          rst = await this.$axios.$get(
            `${searchGoodsList}?keyword=${this.$route.query.keyword}&day=${
              queryObj["day"]
            }&page=${this.currentPage}`
          );
        } else if (queryObj) {
          rst = await this.$axios.$get(
            `${searchGoodsList}?day=${queryObj["day"]}&page=${this.currentPage}`
          );
          this.$route.query.day = queryObj[day];
        } else {
          rst = await this.$axios.$get(
            `${searchGoodsList}?day=${this.$route.query.day}&page=${
              this.currentPage
            }`
          );
        }
        if (!this.$route.query.keyword && !this.$route.query.type) {
          let goodsNum, pageNumAll, goodsList, panel, currentPage;
          //获取到商品总数
          goodsNum = await this.$axios.$get(
            `${searchGoodsList}?day=${this.$route.query.day}&page=all`
          );

          this.goodsNum = goodsNum;
          this.pageNumAll = pageNumAll;
          // this.goodsList = goodsList;
          this.panel = panel || [];
          this.currentPage = currentPage;
        }
        loading.close();
        console.log(55666, rst);
        this.goodsList = rst;
      } catch (e) {
        loading.close();
        this.$message({
          showClose: true,
          message: "数据加载失败"
        });
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
    unique(arr) {
      //数组去重
      var newArr = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr.indexOf(arr[i]) == i && arr[i]) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    goPrePage() {
      if (!this.canSelectPre) return;
      // this.searchParams.catalogId = this.$route.query.cateId;
      this.searchParams.page = this.currentPage - 1;
      debugger;
      this.search();
    },
    goNextPage() {
      if (!this.canSelectNext) return;
      // this.searchParams.catalogId = this.$route.query.cateId;
      this.searchParams.page = this.currentPage + 1;
      debugger;
      this.search();
    },
    async getCart() {
      this.showNumber = await this.productCount();
    },
    ...mapActions("cart", ["productCount"])
  }
};
</script>

<style lang="stylus">
  @import "~assets/mixin.styl"

  .search-goods {
    .border {
      border 1px #ccc solid
    }
    .mini-paging {
      display flex
      .icon {
        width 32px
      }
      .can-selected {
        cursor pointer
        background $white
        color $light-gray
      }
    }
    .mini-amount {
      margin-right 14px
    }
    .left-icon {
      border-right 1px #ccc solid
    }
    .with-border {
      border-width 0 1px
    }
    .arrow {
      margin-left 5px
      display flex
      flex-direction column
      padding-top 4px
    }
    .arrow-up {
      display inline-block
      vertical-align top
      border-bottom 6px solid #ccc
      border-right: 5px solid transparent
      border-left 5px solid transparent
      content ""
    }
    .arrow-up-on {
      border-bottom 6px solid $white
    }
    .arrow-down {
      display inline-block
      vertical-align top
      border-top 6px solid #ccc
      border-right 5px solid transparent
      border-left 5px solid transparent
      content ""
      margin-top 2px
    }
    .arrow-down-on {
      border-top 6px solid #fff
    }
  }
  .main-search {
    padding 20px 0 33px
    flexCenter()
    justify-content space-between

    .logo {
      width 102px
      height 50px
      padding-left: 40px;
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
        border 1px $primary-start solid
        outline none
        &.hasBorder{
          border 2px solid rgba(252,15,61,1)
        }
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
      position: relative;
      .float {
        position absolute
        wh(25px, 16px)
        border-radius 8px 8px 8px 0
        background $primary-start
        font-size 12px
        color #fff
        text-align center
        line-height 16px
        right 2px
        top 4px
      }
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
        border-color $red
      }
      .car-icon {
        margin-right 15px
        width 18px
        height 18px
        backImg('~assets/images/shop-car-icon.png')
      }
    }
  }
  .navList{
    border-bottom 2px $primary-start solid
    ul{
      wh(1200px, 34px)
      margin 0 auto
      overflow hidden
      li{
        float left
        wh(150px, 34px)
        a{
          display: block
          wh(100%, 100%)
          line-height 34px
          color #1A1A1A
          font-size 16px
          text-align center
        }
        .activeA{
          background $primary-start
          color #fff
        }
      }
      .fr{
        float right
      }
    }
  }


  .thisAddress{
    wh(1200px, 40px)
    margin 0 auto
    line-height 40px
    color #1a1a1a
    font-size 12px
    a{
      color: #999999
      line-height 40px
      font-size 12px
    }
  }

  .title-bq{
    width 1200px
    margin 0 auto 30px
    border-bottom  1px #CCCCCC solid
    .bq-child{
      overflow hidden
      border-top 1px
      font-size 12px
      border-top 1px #CCCCCC solid
      .fl{
        float left
      }
      .bq-name{
        width 150px
        /*height 78px*/
        text-indent 10px
        font-size 12px
        span{
          display block
          height 42px
          padding-top 12px
          background #F5F5F5
        }
        .span{
          height 84px
        }
      }
      .bq-list{
        width 910px
        overflow hidden
        li{
          float left
          width 151.66px
          padding 12px 0
          color #0D5A9E
          text-indent 10px
          font-size 12px
          cursor  pointer
        }
      }
      .bq-Num{
        width 910px
        overflow hidden
        li{
          float left
          width 75.83333px
          padding 12px 0
          color #0D5A9E
          text-indent 10px
          font-size 12px
          cursor  pointer
          .lisMore{
            border 1px #ccc solid
            width 84px
            height 24px
            line-height 24px
            margin-left 10px
            font-size: 12px;
            color: #333;
            font-weight: bold;
            img{
              width:12px
            }
          }
        }
      }
      .bq-auto{
        width auto
        li{
          width:auto
          div{
            cursor pointer
          }
        }
      }
      .bq-edit{
        width 140px
        overflow hidden
        div{
          width:58px
          height 24px
          border 1px #ccc solid
          margin-right 10px
          margin-top 9px
          line-height 24px
          text-indent 10px
          font-size 12px
          color #333
          font-weight bold
          overflow hidden
          span{
            float left
          }
          img{
            float left
          }
        }

        .more{
          img{
            width: 12px;
            margin-left: 5px;
            margin-top: 4px;
          }
        }
        .add{
          img{
            width: 12px;
            margin-left: 5px;
            margin-top: 5px;
          }
        }
      }
    }
  }

  .result{
    wh(1200px, 38px)
    margin 20px auto 35px
    background #F5F5F5
    border-top 1px #ccc solid
    border-bottom 1px #ccc solid
    padding 4px 10px
    .result-title{
      overflow hidden
      font-size 12px
      .fr{
        float right
      }
      .fl{
        float left
      }
      .result-eait{
        overflow hidden
        display flex
        font-size: 14px;

        .rank {
          height 24px
          width 60px
          text-indent 14px
          line-height 24px
          cursor pointer
          display flex
          img {
            width 12px
            height 12px
            margin auto
          }
        }
        .active-rank {
          color $white
          background $primary-start
        }
        .result-eait-input{
          overflow hidden
          li{
            height 24px
            border 1px #CCCCCC solid
            text-indent 8px
            line-height 24px
            float left
            background #fff
            color #B3B3B3
            input{
              border 0
              width 38px
              height 90%
            }
          }
        }
      }
      .result-show{
        line-height 24px
        color #999
        p{
          float left
          span{
            color #222
          }
        }
        ul{
          float left
          margin-left 14px
          overflow hidden
          border 1px #ccc solid
          li{
            width: 32px
            float left
            height 24px
            cursor pointer
            img{
              width: 11px;
              height: 13px;
              display: block;
              margin-left: 11px;
              margin-top: 5px;
            }
          }
          .right-icon{
            border-left 1px #ccc solid
            background #fff
          }
        }
      }
    }
  }

  .cart-search-wrap {
    flexCenter()
    justify-content space-between
    padding 25px 0 36px 0
    .logo-wrap {
      flexCenter()
      .logo{
        wh(102px, 50px)
        background #ccc
      }
      .title {
        font-size 20px
        color #666
        margin-left 30px
        font-weight 500
      }
    }
    .search-wrap {
      flexCenter()
      .search-input {
        wh(262px, 32px)
        background #fff
        padding 0 10px
        line-height 32px
        outline none
        border 2px solid $primary-start
      }
      .search-btn {
        wh(38px, 32px)
        background $primary-start
        font-size 20px
        color #fff
        text-align center
        line-height 32px
        cursor pointer
      }
    }
  }
  .resultAll{
    width 1200px
    margin 0 auto
  }
  .resultAll-ul{
    width 1200px
    /*height 1500px*/
    overflow hidden
  }
  .resultAll-ul li{
    margin 0 22px 28px 0
    width 222.4px
    float left
    border 1px transparent solid
    cursor pointer
  }

  .resultAll-ul li:nth-child(5n){
    margin-right 0
  }
  .resultAll-ul li .thisBox{
    padding: 6px
    width:220.4px
    height:310.6px
    border 1px #ccc solid
  }
  .resultAll-ul li:hover{
    border 1px $primary-start solid
  }
  .resultAll-ul li:hover .thisBox{
    border 1px $primary-start solid
  }
  .fixPic{
    width:100%
    height:206.6px
    margin-bottom 10px
  }
  .thisBox div{
    margin-bottom 10px
  }
  .thisBox div img{
    width 36px
    height 36px
    border 1px #ccc solid
    margin-right 5px
  }
  .thisBox h3{
    color $primary-start
    font-size 20px
    font-family SF UI Display
    font-weight bold
    padding-bottom 5px
    line-height 20px
  }
  .thisBox h3 span{
    font-size 14px
  }
  .toXiUrl{
    font-size 12px
    color: #333
  }
  .goods-name{
    font-size 12px
    color: #333
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 18px;
    max-height: 36px;
  }
  .el-pages-box.is-background .btn-next, .el-pages-box.is-background .btn-prev, .el-pages-box.is-background .el-pager li{
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    min-width: 30px;
    border-radius: 2px;
    border: 1px #CCCCCC solid;
    background: #fff;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: normal;
  }
  .el-pages-box button, .el-pages-box span:not([class*=suffix]){
    height 40px
    line-height 40px
  }
  .el-pages-box .el-select .el-input .el-input__inner{
    height 40px
  }
  .el-pages-box .el-pagination__editor.el-input .el-input__inner{
    height 40px
  }
  .el-pages-box.is-background .btn-next{
    margin-right 48px
  }
  .bottomPages{
    width 1200px
    margin 0auto
    overflow  hidden
  }
  .bottomPages .el-pages-box{
    float right
    margin-bottom 30px
  }
  .shutPages{
    float right
    width 60px
    height 40px
    border: 1px #CCCCCC solid;
    text-align center
    line-height 40px
    cursor pointer
    margin-left 10px
    font-size: 14px;
    border-radius 5px
    margin-top 1px
  }
  .toXiUrl:hover{
    color: $primary-start !important;
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
