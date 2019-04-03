<template>
  <div class="main-footer">
    <div class="container">
      <div class="footer-left">
        <div class="footer-nav">
          <nuxt-link to="#" class="footer-link">学校简介</nuxt-link>
          <nuxt-link to="#" class="footer-link">学校动态</nuxt-link>
          <nuxt-link to="#" class="footer-link">合作机构</nuxt-link>
          <nuxt-link to="#" class="footer-link">关于我们</nuxt-link>
          <nuxt-link to="#" class="footer-link">联系我们</nuxt-link>
        </div>
        <div class="msg">
          ©2019 仲恺农业工程学院学子出品 | 广州市白云区钟落潭镇广新路388号 | 025-58305600(工作日提供服务) |
          <a
            style="color:#0f4511;"
          >苏ICP备18047688号</a>
        </div>
      </div>
      <div class="footer-right">
        <img :src="require('@/assets/images/myPic/logo.gif')" class="footer-logo">
        <span class="icon-item" v-popover:wx>
          <i class="iconfont icon-weixin"></i>
        </span>
        <span class="icon-item">
          <i class="iconfont icon-44"></i>
        </span>
        <el-popover ref="wx" placement="top" trigger="hover">
          <img height="150">
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "shop-footer"
};
</script>

<style scoped lang="stylus">
@import '~assets/mixin.styl';

.main-footer {
  background: #444;
  padding: 40px 0 70px;

  .container {
    flexCenter();
    justify-content: space-between;
  }

  .footer-nav {
    flexStart();
    justify-content: space-between;

    .footer-link {
      font-size: 14px;
      color: #fff;
      margin-right: 55px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .msg {
    margin-top: 20px;
    font-size: 12px;
    color: #fff;
  }

  .footer-right {
    flexCenter();

    .footer-logo {
      wh(80px, 80px);
    }

    .icon-item {
      flexCenter();
      justify-content: center;
      wh(34px, 34px);
      border: 2px solid #888888;
      border-radius: 34px;
      cursor: pointer;
      transition: all linear 0.2s;
      margin-left: 20px;

      &:hover {
        border-color: #fff;

        .iconfont {
          color: #fff;
        }
      }

      .iconfont {
        color: #888;
        font-size: 20px;
      }
    }
  }
}
</style>
