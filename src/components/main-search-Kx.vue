<template>
  <div class="main-search container">
    <div class="logo"></div>
    <div class="search-wrap">
      <input type="text" class="search-input" :class="{hasBorder: hasBorder}" placeholder="请输入想要搜索的内容">
      <div class="search-btn"><i class="el-icon-search"></i></div>
    </div>
    <div class="shop-cart-btn">
      <span class="car-icon"></span>
      <span class="text">我的购物车</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "main-srarch-Kx",
  props: ["hasBorder"]
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
      // background #7f828b
    }
    .search-wrap {
      flexCenter()
      .search-input {
        wh(474px, 38px)
        background #fff
        border none
        padding 0 10px
        line-height 38px
        border 1px #FC0F3D solid
        outline none
        &.hasBorder{
          border 2px solid rgba(252,15,61,1)
        }
      }
      .search-btn {
        width 46px
        height 38px
        background $red
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

</style>
