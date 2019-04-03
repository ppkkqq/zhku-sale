<template>
  <div class="collection" @click="collection">
    <i class="el-icon-star-on" :class="{'is-collect': isCollected}"></i>
    <span v-if="isCollected" class="is-collect">已收藏</span>
    <span v-else>收藏</span>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "vCollect",

  props: {
    getCollectData: {
      // type: Function
      // 返回值可能是promise也可能只是静态数据
    },
    getCancelCollectId: {
      // type: Function
      // 返回值可能是promise也可能只是静态数据
    },

    defaultCollectedStatus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isCollected: this.defaultCollectedStatus
    };
  },
  watch: {
    defaultCollectedStatus(status) {
      this.isCollected = status;
    }
  },
  methods: {
    ...mapActions("user", [
      "addCollection",
      "getCollection",
      "deleteCollection"
    ]),

    isFunction(fn) {
      return typeof fn === "function";
    },
    async collection() {
      let collectData = [];

      let data = await (this.isFunction(this.getCollectData)
        ? this.getCollectData()
        : this.getCollectData);
      if (data) {
        collectData = data;
      }

      if (this.isCollected) {
        // 取消收藏
        let cancelCollectId = this.isFunction(this.getCancelCollectId)
          ? this.getCancelCollectId()
          : this.getCancelCollectId;

        if (!cancelCollectId) {
          this.$message("请传入取消收藏需要的数据");
          return;
        }
        let payload = await this.deleteCollection({
          data: cancelCollectId
        });

        if (payload === "success") {
          this.isCollected = false;

          this.$emit("collect");
          this.showMessage("取消收藏成功", "success");
        } else {
          this.showMessage("取消收藏失败，请稍后再试", "fail");
        }
        return;
      }

      let rst = await this.$store.dispatch("user/addCollection", collectData);
      if (rst) {
        this.isCollected = true;
        this.showMessage("收藏成功", "success");
        this.$emit("cancelCollect");
      } else {
        this.showMessage("收藏失败，请稍后再试", "error");
      }
    },

    showMessage(msg, type = "default") {
      this.$message({
        message: msg,
        type: type
      });
    }
  },

  computed: {
    ...mapState("user", {
      userInfo: state => state
    })
  }
};
</script>

<style lang="stylus">
  $primary-color = #0f4511;
  .collection {
    cursor: pointer;

    .is-collect {
      color: $primary-color;
    }
  }
  .collection:active {
    color: $primary-color;
  }
</style>
