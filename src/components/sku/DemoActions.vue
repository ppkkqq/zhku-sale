<template>
  <div class="sku-actions">
    <button v-if="isShowAddCart" @click="skuEventBus.$emit('sku:addCart')">加入购物车</button>
    <button @click="skuEventBus.$emit('sku:purchase')">{{buyBtnText}}</button>
  </div>
</template>

<script>
export default {
  props: {
    buyBtnText: String,
    isShowAddCart: Boolean,
    skuEventBus: Object
  }
};
</script>
