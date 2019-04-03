<template>
  <div class="personal-layout">
    <index-header :hasHome="true"></index-header>
    <seller-main-nav></seller-main-nav>
    <div class="main">
      <seller-side></seller-side>
      <div class="content">
        <nuxt></nuxt>
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
  import sellerMainNav from "@/components/seller-main-nav";
  import indexHeader from "@/components/shop-header";
  import sellerSide from "@/components/seller-left-nav";
  import indexFooter from "@/components/shop-footer";
  export default {
    name: "seller-layout",
    components: {
      indexHeader,
      sellerMainNav,
      sellerSide,
      indexFooter
    }
  };
</script>

<style lang="stylus">
  .main {
    width 1200px
    margin 0 auto
    padding-top: 20px
    display flex
    margin-bottom 80px
    .side {
      width 180px
      margin-right 20px
      .side-item {
        background #ffffff
        padding 30px
        border-bottom 1px solid #E0E0E0
        &:last-child {
          border-bottom none
        }
        li {
          font-size 16px
          color #222222
          margin-bottom 29px
          &:last-child {
            margin-bottom 0
          }
        }
      }
    }
    .content{
      width 1000px
      margin-left 20px
    }
  }
</style>
