<template>
  <div class="shop-header">
    <div class="container">
      <div class="address">
        <template v-if="hasHome">
          <nuxt-link to="/">
            <img :src="require('@/assets/images/myOrder/home-icon.png')" width="14">
            <div class="text" style="margin-right: 20px">返回首页</div>
          </nuxt-link>
        </template>
      </div>
      <div class="message">
        <span class="text">Hi {{user.nickName}} 你好，</span>
        <template v-if="!isLogin">
          <nuxt-link to="/login" class="red">请登录</nuxt-link>
          <nuxt-link to="/register" class="red" style="color: #888;">注册</nuxt-link>
        </template>
        <template v-if="isLogin">
          <span class="red" @click="quit">退出</span>
          <span class="sep"></span>
          <nuxt-link to="/personal/jingjiajilu" class="red" style="color: #888;">个人中心</nuxt-link>
          <span class="sep"></span>
          <nuxt-link to="/seller/commitSell" v-if="!isSeller" class="red" style="color: #888;">申请开店</nuxt-link>
          <nuxt-link to="/seller/selling" v-else class="red" style="color: #888;">卖家中心</nuxt-link>
        </template>
        <span class="sep"></span>
        <span class="text">帮助中心</span>
        <span class="sep"></span>
        <span class="text">客服电话：025-58305600(工作日提供服务)</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import addressSelect from "@/components/address-select";
import { isSeller } from "@/const/api";
import cookie from "js-cookie";
export default {
  name: "shop-header",
  props: ["hasHome"],
  components: {
    addressSelect
  },
  data() {
    return {
      showAddrSel: false,
      city: "",
      isSeller: false
    };
  },
  methods: {
    getSeller() {
      if (this.user) {
        this.$axios.$get(`${isSeller}?userid=${this.user}`).then(res => {
          if (res) {
            this.isSeller = true;
          }
        });
      }
    },
    handleSelected(event) {
      this.$store.commit("update", { selectedCity: event.selected });
    },
    quit() {
      this.$confirm("是否确认退出")
        .then(() => {
          // 清除user数据，跳转至首页
          this.logout().then(() => {
            this.$router.push("/");
          });

          done();
        })
        .catch(() => {});
    },
    closeTab() {
      this.showAddrSel = false;
    }
    // hideSelect(city) {
    //   // this.city = city || this.city
    //   this.showAddrSel = false;

    //   if (!city) {
    //     return;
    //   }
    //   //todo：后续加上adcode
    //   const selectedCity = {
    //     city: city,
    //     cityCode: 1111,
    //     provinceCode: 111,
    //     areaCode: 1111
    //   };
    //   this.$store.commit("update", { selectedCity: selectedCity });
    // },
    // ...mapActions("user", ["logout"])
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    },
    location() {
      return this.$store.state.locationCity;
    },
    locationCity() {
      return this.selectedCity.cityName;
    },
    ...mapGetters("user", ["isLogin"]),
    ...mapGetters(["selectedCity"]),
    ...mapGetters("address", {
      addressList: "list",
      selectedAddress: "selectedAddress"
    })
  },
  mounted() {},
  created() {
    this.getSeller();
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"
  .shop-header {
    background: #F5F5F5;
    font-size: 12px;
    border-bottom: 1px solid #E0E0E0;

    .container{
      flexCenter()
      justify-content space-between
      height 30px
    }

  .address_warp {
    left: 72px !important;
    top: 27px !important;
  }

    .address{
      flexCenter()
      color #888
      a {
        flexCenter()
        .text {
          color #999
        }
      }
      .icon {
        width 12px
        height 15px
        backImg('~assets/images/gps-icon.png')
      }
    }

    .message {
      flexCenter()
      color #888
      .red {
        color $primary-start
        margin-right .3em
      }
    }
    .red, .text{
      cursor: pointer;
    }
    .sep{
      width 1px
      height 14px
      background #888
      margin 0 .3em
    }
  }
</style>
