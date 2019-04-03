<template>
  <div id="app-main">
    <nuxt class="app" />
    <!--<index-footer></index-footer>-->
  </div>
</template>

<script>
import indexFooter from "@/components/shop-footer";

export default {
  components: {
    indexFooter
  }
};
</script>

<style lang="stylus">
  .app {
    min-height 100%
  }
  .el-checkbox__label {
	    padding-left: 5px !important;
	    font-size: 12px !important;
	}
</style>
