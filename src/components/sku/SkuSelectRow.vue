<template>
  <dl class="sku-row">
    <dt v-if="isShowTitle" class="sku-title">{{skuRow.k}}</dt>
    <dd class="sku-row-items">
      <!-- <ul> -->
        <slot />
      <!-- </ul> -->
    </dd>
  </dl>
</template>

<script>
export default {
  props: {
    skuRow: Object,
    isShowTitle: Boolean
  }
};
</script>
