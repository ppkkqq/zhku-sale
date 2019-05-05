<template>
  <div class="pages" style="background: #fff;">
    <div class="header">
      <div class="hmid">
        欢迎登录
      </div>
    </div>
    <div class="content">
      <div class="middle">
        <nuxt-link to="/">
         <img class="haibao" :src="require('@/assets/images/myPic/loginPage.jpg')"/>
        </nuxt-link>
        <span style="color: #fff;font-size: 20px;">为美好的校园生活补短板</span>
        <div class="right">
          <img class="qiehuan" :src="require('@/assets/images/qiehuan.png')"/>
          <div class="r-top">
            <div class="account" :class="{active:accountLogin}">
              <span>帐号登录</span>
            </div>
            <!--<div class="account" :class="{active:!accountLogin}" @click="changeLoginStyle">-->
              <!--<span>验证码登录</span>-->
            <!--</div>-->
          </div>
          <div class="r-middle" v-show="accountLogin">
            <input type="text" name="username" v-model="mobile" placeholder="帐号" @focus="removeTips('mobile')" @blur="checkInput('mobile')"/>
            <span class="tips" v-if="isError('mobile')&&errorShow"><i class="el-icon-error"></i> 帐号不能为空</span>

            <input type="password" name="password" v-model="password" placeholder="密码" @focus="removeTips('password')" @blur="checkInput('password')"/>
            <span class="tips" v-if="isError('password')&&errorShow"><i class="el-icon-error"></i> 密码不能为空</span>

            <!--<input type="text" class="code" name="text" v-model="code" placeholder="验证码" @focus="removeTips('code')" @blur="checkInput('code')"/>-->
            <!--<img @click='getCode' class="codeimg" :src="validateImageSrc"/>-->
            <!--<span  class="tips" v-if="isError('code')&&errorShow"><i class="el-icon-error"></i> 验证码不能为空</span>-->
            <!--<span  class="tips" v-else-if="!judgeCode&&errorShow"><i class="el-icon-error"></i> 请输入正确的验证码</span>-->

            <div style="margin-top: 10px;">
              <el-checkbox v-model="checked">七天内自动登录</el-checkbox>
              <!--<a class="forget" href="#">忘记密码？</a>-->
              <!--<nuxt-link to="/personal/safety/resetPassword" class="forget">忘记密码</nuxt-link>-->
            </div>
            <a class="button" @click="loginByAccount">登录</a>
            <div class="notice">
              登录即代表您同意我们的<a href="#" style="color: #4D4D4D;">服务协议和隐私政策</a>
            </div>
          </div>


          <!--<div class="r-middle" style="display: none;" v-show="!accountLogin">-->
            <!--<input type="text" name="username" v-model="mobile" placeholder="手机号" @focus="removeTips('mobile')" @blur="checkInput('mobile')"/>-->
            <!--<span class="tips" v-if="isError('mobile')&&errorShow"><i class="el-icon-error"></i> 手机号不能为空</span>-->

            <!--<div style="position: relative;">-->
              <!--<input type="text" class="phonecode" name="phonecode" v-model="phonecode" placeholder="短信验证码" @focus="removeTips('phonecode')" @blur="checkInput('phonecode')" maxlength="6" />-->
              <!--<a v-if="!remainedSeconds" id="getphonecode"  class="regbtn" @click="onSendPhonecode">获取验证码</a>-->
              <!--<a class="graybtn" v-else>{{remainedSeconds+'秒'}}</a>-->
            <!--</div>-->
            <!--<span  class="tips" v-if="isError('phonecode')&&errorShow"><i class="el-icon-error"></i> 验证码不能为空</span>-->

            <!--<div style="margin-top: 10px;">-->
              <!--<el-checkbox v-model="checked">七天内自动登录</el-checkbox>-->
              <!--<a class="forget" href="#">忘记密码？</a>-->
            <!--</div>-->
            <!--<a class="button" @click="loginByPhone">登录</a>-->
            <!--<div class="notice">-->
              <!--登录即代表您同意我们的<a href="#" style="color: #4D4D4D;">服务协议和隐私政策</a>-->
            <!--</div>-->
          <!--</div>-->
          <div class="r-bottom">
            <nuxt-link class="b_register" to="/register">立即注册 ></nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container">
        <div class="footer-nav">
          <nuxt-link to="#" class="footer-link">学校简介</nuxt-link> |
          <nuxt-link to="#" class="footer-link">学校动态</nuxt-link> |
          <nuxt-link to="#" class="footer-link">合作机构</nuxt-link> |
          <nuxt-link to="#" class="footer-link">关于我们</nuxt-link> |
          <nuxt-link to="#" class="footer-link">联系我们</nuxt-link>
        </div>
        <div >©2019 仲恺农业工程学院学子出品 | 广州市白云区钟落潭镇广新路388号 | 025-58305600(工作日提供服务) </div>
      </div>
    </div>
    <nuxt/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mobileRule } from "@/const/rules";
import { checkLoginMobile, verifySmsCode, loginUrl } from "@/const/api";

const CAPTCHA_TIMEOUT = 60;
export default {
  name: "login",
  data() {
    return {
      remainedSeconds: null,
      captchaTimer: null,
      mobile: "",
      password: "",
      code: "",
      phonecode: "",
      checked: true,
      isNull: {
        mobile: false,
        password: false,
        code: false,
        phonecode: false
      },
      validateImageSrc: "",
      validateId: "",
      accountLogin: true,
      judgeCode: true,
      errorShow: false
    };
  },
  computed: {},
  mounted() {
    this.getCode();
  },
  methods: {
    getCode() {
      this.$axios
        .$get(
          `/mall-deepexi-member-center/api/v1/mcMemberAccounts/getValidateCode`
        )
        .then(res => {
          console.log(333334, res);
          this.validateImageSrc =
            "data:image/png;base64," + res.payload.validateImageSrc;
          this.validateId = res.payload.validateId;
          console.log(res);
          console.log(this.validateImageSrc);
          // console.log(res.payload);
          // console.log(res.payload.validateImageSrc);
          // console.log(res.payload.validateId);
        })
        .catch(err => {});
    },
    // changeLoginStyle(event) {
    //   // this.isAt = !this.isAt
    //   let cont = event.currentTarget.innerText;
    //   if (cont.indexOf("帐号登录") > -1) {
    //     this.accountLogin = true;
    //   } else {
    //     this.accountLogin = false;
    //   }
    // },
    checkInput(ele) {
      const target = this[ele];
      this.isNull[ele] = target.replace(/^\s+|\s+$/g, "") == "";
      // if (ele == "mobile") {
      //   if (this.mobile.replace(/^\s+|\s+$/g, "") == "") {
      //     this.isNull.mobile = true;
      //   } else {
      //     this.isNull.mobile = false;
      //   }
      // }
      // if (ele == "password") {
      //   if (this.password.replace(/^\s+|\s+$/g, "") == "") {
      //     this.isNull.password = true;
      //   } else {
      //     this.isNull.password = false;
      //   }
      // }
      // if (ele == "code") {
      //   if (this.code.replace(/^\s+|\s+$/g, "") == "") {
      //     this.isNull.code = true;
      //   } else {
      //     this.isNull.code = false;
      //   }
      // }
    },
    removeTips(ele) {
      this.isNull[ele] = false;

      // if (ele == "mobile") {
      //   this.isNull.mobile = false;
      // }
      // if (ele == "password") {
      //   this.isNull.password = false;
      // }
      // if (ele == "code") {
      //   this.isNull.code = false;
      // }
    },
    isError(ele) {
      return this.isNull[ele];
      // if (ele == "mobile") {
      //   return this.isNull.mobile;
      // }
      // if (ele == "password") {
      //   return this.isNull.password;
      // }
      // if (ele == "code") {
      //   return this.isNull.code;
      // }
      // return false;
    },
    volidate() {
      // 检验是否为空
      const volidateArr = ["mobile", "password"];
      var result = volidateArr.find(item => {
        const target = this[item];
        if (!target.replace(/^\s+|\s+$/g, "")) {
          this.isNull[item] = true;
          return true;
        }
      });

      if (result && result.length) {
        return false;
      }
      return true;
    },

    async loginByAccount() {
      this.errorShow = true;
      this.judgeCode = true;
      let data = {
        user: this.mobile,
        psw: this.password
      };
      if (!this.volidate()) {
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.05)"
      });
      let rst = this.login(data);
      rst
        .then(payload => {
          if (payload == "error") {
            //bug待解决
            this.$message.error("用户名密码不正确");
          } else {
            this.$message.success("登录成功");
            this.$router.push("/");
          }
        })
        .catch(err => {
          this.getCode();
          this.$message.error("网络超时，请稍后重试");
        })
        .finally(() => {
          loading.close();
        });
    },
    ...mapActions("user", ["login"])
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"
  .header{
    wh(100%, 60px);
    background: #fff;
    font-size:24px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:#4D4D4D;
    line-height:60px;
    .hmid{
      wh(1000px, 60px);
      margin:0 auto;
    }
    img{
      margin-right: 20px;
      margin-bottom: -15px;
    }
  }
  .content{
    wh(100%, auto);
    background: #dde1e4;
    height: 550px;
    .middle{
      width: 1000px;
      margin: 0 auto;

      .haibao{
        margin-top: 100px;
        width: 300px;
      }
      .right{
        background: #fff;width: 350px;height: 410px;float: right;margin-top: 56px;position: relative;border-radius: 2px;
      }
    }
    .right .r-top{
      width: 200px;
      margin: 0 auto;
      padding-top: 25px;
    }
    .right .qiehuan{
      width: 47px;
      height: 62px;
      position: absolute;
      right: 0;
      top: 0;
      margin-top: 0;
      cursor: pointer;
      border-radius: 2px;
    }
    .right .r-top .account{
      width: 100px;
      /*float: left;*/
      margin-left: 50px;
      text-align: center;
      font-size: 18px;
      cursor: pointer;
    }
    .right .r-top .account span{
      color: #888888;
    }
    .right .r-top .account.active span{
      border-bottom:2px solid $primary-start ;
      color: $primary-start;
    }
    .right .r-middle{
      padding: 0 30px;
      margin-top: 40px;
    }
    .right .r-middle input{
      color: #a8a8a8;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      font-size: 16px;
      margin-top: 10px;
      border: 0;
      background: #f0f1f2;
      border-radius: 3px;
    }
    .right .r-middle .code{
      width:160px;
    }
    .right .r-middle .phonecode{
      width:100%;
    }
    .right .r-middle .codeimg{
      width: 120px;
      height: 40px;
      float: right;
      margin-top: 7px;
    }
    .right .r-middle .forget{
      color: #ABAEB2;
      cursor: pointer;
      float: right;
    }
    .right .r-middle .button{
      width: 100%;
      margin-top: 20px;
      font-size: 18px;
      text-align: center;
      color: #fff;
      background: $primary-start;
      height: 40px;
      border-radius: 3px;
      line-height: 36px;
      cursor: pointer;
      display: block;
    }
    .right .r-middle .regbtn{
      color: $primary-start !important;
      border: 1px solid $primary-start;
      padding: 0;
      border-radius: 2px;
      margin: 0;
      display: inline-block;
      position: absolute;
      width: 80px;
      top: 15px;
      right: 5px;
      text-align: center;
      height: 30px;
      line-height: 26px;
      font-size: 12px;
    }

    .right .r-middle .graybtn{
      color: #CCC !important;
      border: 1px solid #CCC;
      padding: 0;
      border-radius: 2px;
      margin: 0;
      display: inline-block;
      position: absolute;
      width: 80px;
      top: 15px;
      right: 5px;
      text-align: center;
      height: 30px;
      line-height: 26px;
      font-size: 12px;
    }

    .right .r-middle .button:active{
      background-color:#0f4511 !important;
    }
    .right .r-middle .notice{
      font-size: 12px;
      color: #ABAEB2;
      margin-top: 8px;
    }
    .right .r-bottom{
      height: 48px;
      margin-bottom: 0;
      background: #fcfcfc;
      border-bottom-left-radius: 2px;
      border-bottom-right-radius: 2px;
      position: absolute;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #efefef;
      .b_register {
        width: 146px;
        float: right;
        padding-right: 20px;
        text-align: right;
        height: 48px;
        line-height: 48px;
        color: #0f4511;
        font-size: 16px;
        cursor: pointer;
      }
    }

  }
  .footer{
    width: 100%;
    height: 100px;
    background: #fff;
  }
  .container {
    width: 1000px;
    margin: 0 auto;
    text-align: center;
    color: #4D4D4D;
    margin-top: 25px;
  }
  .footer-link{
    color: #4D4D4D;
    margin: 0 10px;
  }
  .tips{
    font-size: 12px;
    color:red;
    display: inline-block;
    width: 100%;
    padding-left: 3px;
  }

</style>
