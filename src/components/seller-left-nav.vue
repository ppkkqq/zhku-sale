<template>
  <div class="left-main-nav">
    <div class="nav-item">
      <nuxt-link to="/seller/#" class="item-link">店铺订单</nuxt-link>
      <nuxt-link to="/seller/newProduct" class="item-link">发布商品</nuxt-link>
      <nuxt-link to="/seller/selling" class="item-link">拍卖中的商品</nuxt-link>
      <nuxt-link to="/seller/comment" class="item-link">评价管理</nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "seller-left-nav"
  };
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"

  .left-main-nav {
    width 180px
    background #fff
    .nav-item {
      flexCenter(flex-start, column)
      padding 15px 30px
      border-bottom 1px solid #e0e0e0
      &:last-child {
        border none
      }
      .item-link {
        position relative
        font-size 16px
        color #222
        margin-bottom 8px
        &.nuxt-link-active:before {
          content ''
          position absolute
          left -15px
          top 50%
          transform translateY(-50%)
          width 3px
          height 16px
          background #0f4511
          display block
        }
        &:last-child {
          margin 0
        }
      }
    }
  }

</style>
