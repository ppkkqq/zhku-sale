<template>
  <div class="personal-layout">
    <index-header :hasHome="true"></index-header>
    <user-main-nav></user-main-nav>
    <div class="main">
      <user-side></user-side>
      <div class="content">
        <nuxt></nuxt>
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
import userMainNav from "@/components/user-main-nav";
import indexHeader from "@/components/shop-header";
import userSide from "@/components/user-left-nav";
import indexFooter from "@/components/shop-footer";
export default {
  name: "personal-layout",
  components: {
    indexHeader,
    userMainNav,
    userSide,
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
