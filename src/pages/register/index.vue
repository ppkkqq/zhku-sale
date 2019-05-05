<template>
    <div class="pages" style="background: #fff;">
      <div class="header">
        <div class="hmid">
          <nuxt-link to="/"><img :src="require('@/assets/images/myPic/logo.gif')"  width="90px"/></nuxt-link>用户注册
          <div style="float: right;font-size: 15px;">
            已有帐号？
            <nuxt-link to="/login" style="color:rgb(27, 115, 225)">直接登录 <i class="el-icon-arrow-right"></i></nuxt-link>
          </div>
        </div>
      </div>
    <div class="content">
        <div class="middle" v-show="step==1">
           <img style="margin-top: 60px;" :src="require('@/assets/images/step1.png')"/>
           <div class="form">
             <div class="item">
              <div class="title">
                +86 <img :src="require('@/assets/images/ownc.png')"/>
              </div>
              <input type="text" class="phone" v-model.trim="mobile" name="mobile" @focus="removeTips('mobile')" @blur="checkInput('mobile')" maxlength="11" />
              <span  class="tips" v-show="isError('mobile')"><i class="el-icon-error"></i> {{tipsMobile}}</span>
             </div>
             <!--<div class="item" style="margin-top: 30px;">-->
              <!--<div class="title">-->
                <!--短信验证码-->
              <!--</div>-->
              <!--<input type="text" class="phone" v-model.trim="code" name="code"  v-on:input ="inputFunc" @focus="removeTips('code')" @blur="checkInput('code')" style="width: 230px;float: left;" maxlength="6"/>-->
              <!--<div class="sendCode" @click="sendCode" v-show="showSend">-->
                <!--发送验证码-->
              <!--</div>-->
              <!--<div-->
                <!--id="daojishi"-->
                <!--class="sendCode"-->
                <!--v-show="!showSend"-->
                <!--style="background: gray;">重新发送({{count}})</div>-->
             <!--</div>-->
             <!--<span  class="tips" v-show="isError('code')"><i class="el-icon-error"></i> {{tipsCode}}</span>-->
             <!--<div class="next" v-show="!next">下一步</div>-->
             <div class="next active" @click="showNext" >下一步</div>
           </div>
        </div>
        <div class="middle" v-show="step==2">
           <img style="margin-top: 60px;" :src="require('@/assets/images/step2.png')"/>
           <div class="form">
             <div class="item">
               <div class="title">
                 设置昵称
               </div>
               <input type="text" class="phone" name="password" v-model.trim="nickName"/>
             </div>
             <div class="item">
              <div class="title">
                设置密码
              </div>
              <input type="password" class="phone" name="password" v-model.trim="password" @focus="removeTips('password')" @blur="checkInput('password')"/>
              <span  class="tips" v-show="isError('password')"><i class="el-icon-error"></i> {{tipsPassword}}</span>
             </div>
             <div class="item">
              <div class="title">
                确认密码
              </div>
              <input type="password" class="phone" name="password2" v-on:input ="inputFunc2" v-model.trim="password2" @focus="removeTips('password2')" @blur="checkInput('password2')"/>
              <span  class="tips" v-show="isError('password2')"><i class="el-icon-error"></i> 两次输入密码不一致</span>
             </div>
             <div class="item">
               <div class="title">
                 设置邮箱
               </div>
               <input type="text" class="phone" name="password" v-model.trim="email"/>
             </div>
              <div class="next" v-show="!next">立即注册</div>
             <div class="next active" v-show="next" @click="registerNow" >立即注册</div>

           </div>
        </div>
        <div class="middle" v-show="step==3">
           <div class="form" style="margin-top: 0;">
            <i class="el-icon-circle-check" style="margin-top: 120px;font-size: 48px;color: #50B33D;"></i>
             <div class="item" style="margin-top: 23px;color: #333333;font-size: 24px;font-family: MicrosoftYaHeiUI-Bold;font-weight: bold;height: 24px;line-height: 24px;">
              恭喜您 {{mobile}}
             </div>
             <div class="item" style="margin-top: 15px;font-size: 15px;font-family: PingFangSC-Medium;font-weight: 500;color: #999999;height: 15px;">
              您已成功注册成为仲恺线上拍卖用户，祝您体验愉快!
             </div>
             <nuxt-link class="tiyan" to="/">去体验</nuxt-link>
           </div>
        </div>
        <div class="middle" v-show="step==4">
           <div class="form" style="margin-top: 0;">
            <i class="el-icon-error" style="margin-top: 120px;font-size: 48px;color: rgb(216, 51, 74)"></i>
            <!-- <div class="item" style="margin-top: 23px;color: rgb(216, 51, 74);font-size: 24px;font-family: MicrosoftYaHeiUI-Bold;font-weight: bold;height: 24px;line-height: 24px;">
              注册失败
             </div>-->
             <div class="item" style="margin-top: 15px;font-size: 15px;font-family: PingFangSC-Medium;font-weight: 500;color: #999999;height: 15px;">
              该手机号已注册
             </div>
             <nuxt-link class="tiyan" to="/">返回</nuxt-link>
           </div>
        </div>
        <div class="middle" v-show="step==5">
           <div class="form" style="margin-top: 0;">
            <i class="el-icon-error" style="margin-top: 120px;font-size: 48px;color: rgb(216, 51, 74);"></i>
            <!-- <div class="item" style="margin-top: 23px;color: rgb(216, 51, 74);font-size: 24px;font-family: MicrosoftYaHeiUI-Bold;font-weight: bold;height: 24px;line-height: 24px;">
              注册失败
             </div>-->
             <div class="item" style="margin-top: 15px;font-size: 15px;font-family: PingFangSC-Medium;font-weight: 500;color: #999999;height: 15px;">
              网络错误，请稍后再试
             </div>
             <nuxt-link class="tiyan" to="/">返回</nuxt-link>
           </div>
        </div>
      </div>
    <div class="footer">
        <div class="container">
            <div class="footer-nav">
              <nuxt-link to="#" class="footer-link">系统简介</nuxt-link> |
              <nuxt-link to="#" class="footer-link">系统动态</nuxt-link> |
              <nuxt-link to="#" class="footer-link">合作机构</nuxt-link> |
              <nuxt-link to="#" class="footer-link">关于我们</nuxt-link> |
              <nuxt-link to="#" class="footer-link">联系我们</nuxt-link>
            </div>
          <div >©2019 仲恺线上拍卖系统 | 广州市白云区钟落潭镇广新路388号 | 13609069934(工作日提供服务)</div>
        </div>
      </div>
     <nuxt/>

  </div>
</template>

<script>
import { mobileRule, passwordRule } from "@/const/rules";
import { checkMobile, verifySmsCode, addRegister } from "@/const/api";

export default {
  name: "login",
  data() {
    return {
      randomCode: "",
      mobile: "",
      code: "",
      password: "",
      password2: "",
      nickName: "",
      email: "",
      isNull: {
        mobile: false,
        code: false,
        password: false,
        password2: false
      },
      showSend: true,
      count: "",
      timer: null,
      isSend: false,
      next: false,
      step: 1,
      tipsCode: "验证码不能为空",
      tipsMobile: "手机号不能为空",
      tipsPassword: "密码不能为空"
    };
  },
  methods: {
    checkInput(ele) {
      if (ele == "mobile") {
        if (this.mobile == "") {
          this.isNull.mobile = true;
          this.tipsMobile = "手机号不能为空";
        } else {
          if (!mobileRule.pattern.test(this.mobile)) {
            this.isNull.mobile = true;
            this.tipsMobile = "请输入正确的手机号";
          } else {
            this.isNull.mobile = false;
          }
        }
      }
      if (ele == "code") {
        if (this.code == "") {
          this.isNull.code = true;
        } else {
          this.isNull.code = false;
        }
      }
      if (ele == "password") {
        if (this.password == "") {
          this.isNull.password = true;
        } else if (!passwordRule.pattern.test(this.password)) {
          //  ^(?=.*\d+.*)(?=.*[a-z]+.*)(?=.*_.*)[\da-z_]{6,}$
          this.isNull.password = true;
          this.tipsPassword =
            "密码必须由字母、数字或下划线组成，长度在8-16之间";
        } else {
          this.isNull.password = false;
        }
      }
      if (ele == "password2") {
        if (this.password2 != this.password && this.password2 != "") {
          this.isNull.password2 = true;
        } else {
          this.isNull.password2 = false;
        }
      }
    },
    inputFunc() {
      if (this.isSend && this.code.length == 6) {
        this.next = true;
      } else {
        this.next = false;
      }
    },
    inputFunc2() {
      if (!this.isNull.password && this.password2 == this.password) {
        this.next = true;
      } else {
        this.next = false;
      }
    },
    showNext() {
      //校验验证码
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.05)"
      // });

      // this.$axios
      //   .$post(verifySmsCode, { mobile: this.mobile, code: this.code })
      //   .then(result => {
      //     this.randomCode = result.payload;
      //     this.step = 2;
      //     this.next = false;
      //     loading.close();
      //   })
      //   .catch(err => {
      //     const msg =
      //       (err.response.data && err.response.data.payload) ||
      //       "输入的手机号或密码错误";
      //     this.$message.error(msg);
      //     loading.close();
      //   });
      if (this.count) {
        return;
      }
      if (!this.mobile) {
        this.$message.error("手机号不能为空");
        return;
      }
      if (!mobileRule.pattern.test(this.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }
      this.step = 2;
      this.next = false;
    },

    sendCode() {
      if (this.count) {
        return;
      }
      if (!this.mobile) {
        this.$message.error("手机号不能为空");
        return;
      }
      if (!mobileRule.pattern.test(this.mobile)) {
        this.$message.error("请输入正确的手机号");
        return;
      }

      this.$axios
        .$post(checkMobile, {
          mobile: this.mobile
        })
        .then(res => {
          this.$message({
            message: `我们已向${this.mobile}发送验证码短信，请查看并输入验证码`,
            type: "success"
          });

          this.showSend = false;
          this.isSend = true;
          this.time();
        })
        .catch(err => {
          const msg =
            (err.response.data && err.response.data.payload) ||
            "服务器繁忙，请稍后再试";
          this.$message.error(msg);
        });
    },

    async registerNow() {
      let data = {
        nickName: this.nickName,
        mobile: this.mobile,
        password: this.password,
        email: this.email
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.05)"
      });
      let rst = await this.$axios.$post(addRegister, data);
      if (rst == "success") {
        loading.close();
        this.step = 3;
      } else if (rst == "已经注册过") {
        this.step = 4;
      } else {
        this.step = 5;
      }
      loading.close();
    },
    removeTips(ele) {
      if (ele == "mobile") {
        this.isNull.mobile = false;
      }
      if (ele == "code") {
        this.isNull.code = false;
      }
    },
    isError(ele) {
      if (ele == "mobile") {
        return this.isNull.mobile;
      }
      if (ele == "code") {
        return this.isNull.code;
      }
      if (ele == "password") {
        return this.isNull.password;
      }
      if (ele == "password2") {
        return this.isNull.password2;
      }
      return false;
    },
    volidate() {
      if (this.mobile == "") {
        this.isNull.mobile = true;
        this.tipsMobile = "手机号不能为空";
        return false;
      }
      return true;
    },
    volidate2() {
      if (this.mobile == "") {
        this.isNull.mobile = true;
        return false;
      }
      if (this.code == "") {
        this.isNull.code = true;
        return false;
      }
      return true;
    },
    time() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.showSend = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.showSend = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }
};
</script>

<style scoped lang="stylus">
  @import "~assets/mixin.styl"
  .header{
    wh(100%, 100px);
    background: #fff;
    font-size:24px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:#4D4D4D;
  line-height:100px;
  .hmid{
    wh(1000px, 100px);
    margin:0 auto;
  }
    img{
      margin-right: 20px;
    margin-bottom: -15px;
    }
  }
  .content{
    wh(100%, auto);
    background:#0f4511;
    height:610px;
    padding-top: 20px;
    border-radius:2px;
    .middle{
      width: 1000px;
      margin: 0 auto;
      height: 570px;
      background: #fff;
      text-align: center;
    }
    .middle .form{
      width: 480px;
    margin: 0 auto;
    margin-top: 60px;
    font-size:15px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    }
    .middle .form .item{
      height: 50px;
      margin-top: 20px;
    }
    .middle .form .title{
      width: 120px;
    float: left;
    height: 50px;
    line-height: 50px;
    color: rgba(51,51,51,1);
    border: 1px solid rgba(224,224,224,1);
    border-right: 0;
    }
    .middle .form .phone{
      width: 360px;
    height: 50px;
    line-height: 50px;
    padding-left: 5px;
    border: 1px solid rgba(224,224,224,1);
    color: rgba(51,51,51,1);
    }
    .middle .form .sendCode{
      width: 120px;
    height: 50px;
    float: right;
    line-height: 50px;
    background: #0f4511;
    color: #fff;
    cursor: pointer;
    }
    .middle .form .next{
      width:480px;
    height:50px;
    display: block;
    background: #48913a;
    opacity:0.2;
    color:#fff;
    line-height:50px;
    margin-top: 40px;
    cursor: pointer;
    }
    .middle .form .tiyan{
      width: 140px;
    height: 50px;
    display: block;
    background: #0f4511;
    color: #fff !important;
    line-height: 50px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 38px;
    }
    .middle .form .active{
      opacity:1 !important;
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
      float: left;
      display: inline-block;
      color: red;
      padding-left: 3px;
      font-size: 12px;
   }

</style>
