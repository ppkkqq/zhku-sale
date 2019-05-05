<template>
  <div class="containt">
    <el-form ref="form" :model="form" label-width="110px">
      <el-form-item label="店铺名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="QQ">
        <el-input v-model="form.qqChar"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="form.idCard"></el-input>
      </el-form-item>
      <form role="form" :action="addSellerPic" method="post" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <el-form-item label="身份证正面照">
          <input type="file" required="required" name="pic1" accept="image/*" style="cursor: pointer;">
        </el-form-item>
        <el-form-item label="身份证反面照">
          <input type="file" required="required" name="pic2" accept="image/*" style="cursor: pointer;">
        </el-form-item>
        <el-form-item>
          <input type="submit" value="提交申请" class="submit-pic">
          <el-button>取消</el-button>
        </el-form-item>
      </form>
    </el-form>
  </div>
</template>

<script>
import { addSellerPic, commitSeller } from "@/const/api";
export default {
  name: "commitSell",
  layout: "seller-layout",
  data() {
    return {
      form: {
        name: "",
        qqChar: "",
        idCard: ""
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    onSubmit(event) {
      if (!this.form.name || !this.form.qqChar || !this.form.idCard) {
        this.$message("必填项不能为空");
        return;
      }
      this.$confirm(`您确认提交该申请吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formData = new FormData(event.target);
        this.$axios.$post(addSellerPic, formData).then(res => {
          if (res == "error") {
            this.$message.error("图片上传失败，请稍后再试");
            return false;
          } else {
            this.picList = res;
            this.addCommit();
          }
        });
      });
      return false;
    },
    async addCommit() {
      this.$axios
        .$post(commitSeller, {
          user: this.user,
          storeName: this.form.name,
          qqChar: this.form.qqChar,
          idCard: this.form.idCard,
          images: this.picList
        })
        .then(res => {
          if (res == "success") {
            this.$message.success("提交申请成功");
            this.$router.push({ path: "/" });
          } else {
            this.$message.error("提交申请失败，请稍后再试");
          }
        })
        .catch(() => {});
    }
  },
  created() {
    this.addSellerPic = addSellerPic;
  }
};
</script>

<style lang="stylus">
.containt{
  background-color: #fff;
  padding: 14px 340px 4px 50px;
}
.submit-pic{
  display: inline-block;
  margin-top: 10px;
  padding: 12px 40px;
  background-color: #67c23a;
  color: #fff;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}
</style>
