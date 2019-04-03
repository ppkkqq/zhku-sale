<template>
  <div>
    <sku-select 
      ref="sku" 
      @dataUpdate="onSelectSku" 
      :sku="sku" 
    />
    <sku-actions 
      :sku-event-bus="skuEventBus" 
      buyBtnText="立即购买"
      isShowAddCart
    />
  </div>
</template>

<script>
import SkuSelect from "./SkuSelect";
import SkuActions from "./DemoActions";
import Vue from "vue";
// import ApiSku from './mock'
import api2 from "./mock";
import { convert } from "./utils";

//转换请求的商品详情数据
const sku = convert(api2.payload, { priceType: "guidePrice" });

export default {
  components: {
    SkuSelect,
    SkuActions
  },
  data() {
    return {
      sku: sku,
      selectedSku: {}
    };
  },
  beforeDestroy() {
    // this.skuEventBus.off()
  },
  created() {
    this.skuEventBus = new Vue();
    this.skuEventBus.$on("sku:addCart", this.addCart);
    this.skuEventBus.$on("sku:purchase", this.puchase);
  },
  methods: {
    // 只要结果
    puchase() {
      const result = this.$refs.sku[0].getSelectedSku();
      console.log(result);
    },
    // 如果要获取用户选择的事件可以监听dataUpdate,
    // 第1参数为选择了的规格项
    // 第2参数为符合规格项的 最低价/最高价sku(用于价格区间展示),
    //   以及所有符合sku项的库存总和(库存展示), 当出现finalComb的时候表示出现唯一匹配的sku.
    onSelectSku(selectedSku, matchedSkus) {
      this.selectedSku = selectedSku;
      console.log(matchedSkus);
    },
    addCart() {}
  }
};
</script>

<style lang="stylus">
.sku {
  position: relative;
  .sku-row {
    .sku-row-items, .sku-title {
      display: inline;
      ul {
        display: inherit;
        margin: 0;
        padding: 0;
      }
      .sku-row-item-active{
        color: red;
      }
      .sku-row-item-disabled{
        color:grey;
      }
    }
  }
}
</style>
