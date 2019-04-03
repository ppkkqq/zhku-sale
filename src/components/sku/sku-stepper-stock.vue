<template>
  <div class="sku-stepper-stock">
    <div class="sku-stepper-container">
      <div class="sku__stepper-title">购买数量：</div>
      <slot :totalStock="totalStock" ></slot>
      <!-- <van-stepper :value="quantity"
                   integer
                   :min="1"
                   :max="totalStock"
                   :step="1"
                   :default-value="1" /> -->
    </div>
    <div class="sku-stepper-msg-container">
      <div class="sku__stock">库存：{{totalStock}}件</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "sku-stepper-stock",
  props: {
    totalStock: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="stylus">
.sku-stepper-stock {
  // border-top: 1px solid #e5e5e5;
  // border-bottom: 1px solid #e5e5e5;
  padding: 34px 20px;
  padding-top: 23px;
  .sku-stepper-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: left;
    .sku__stepper-title {
      line-height: 30px;
      float: left;
    }
  }

  .sku-stepper-msg-container {
    display: flex;
    float: left;
    margin-top: 3px;

    .sku__stock {
      margin-left: 19px;
      color: #999;
      font-size: 15px;
    }

    .sku__quota {
      color: #f44;
      font-size: 12px;
    }
  }
}
</style>
