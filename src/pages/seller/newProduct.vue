<template>
  <div class="page" style="background-color: #fff;">
    <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
      <el-form-item label="商品名称">
        <el-input v-model="sizeForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商品类目">
        <el-select v-model="sizeForm.type" placeholder="请选择商品所属类目">
          <el-option label="配件" value="配件"></el-option>
          <el-option label="箱包" value="箱包"></el-option>
          <el-option label="鞋靴" value="鞋靴"></el-option>
          <el-option label="电脑硬件" value="电脑硬件"></el-option>
          <el-option label="家居用品" value="家居用品"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date2" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="起拍价格">
        <el-input-number v-model="sizeForm.price" :precision="2" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item label="商品地址">
        <el-input v-model="sizeForm.address"></el-input>
      </el-form-item>
      <form class="form-horizontal templatemo-create-account templatemo-container" role="form"
            :action="addCommentPic" method="post" enctype="multipart/form-data" @submit.prevent="submitPic">
        <el-form-item label="主图">
          <el-upload
            class="upload-demo"
            :action="123"
            :multiple="multiple"
            :on-change="handleChange1"
            :on-remove="handleRemove1"
            :file-list="imageList"
            list-type="picture">
            <input type="file" required="required" name="pic[]" accept="image/*" multiple style="cursor: pointer;">
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <p class="cx-shai">最多可上传3张图片，每张图片大小不超过5M，支持bmp,gif,jpg,png,jpeg格式文件</p>
        </el-form-item>
        <el-form-item label="详情图">
          <el-upload
            class="upload-demo"
            :action="123"
            :multiple="multiple"
            :on-change="handleChange2"
            :on-remove="handleRemove2"
            :file-list="detailImage"
            list-type="picture">
            <input type="file" required="required" name="detailPic" accept="image/*" multiple style="cursor: pointer;">
            <div slot="tip" class="el-upload__tip">只能上传一个jpg/png文件，且不超过5000kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input type="textarea" :rows="3" v-model="sizeForm.desc"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <input type="submit" value="立即创建" class="submit-pic">
          <el-button>取消</el-button>
        </el-form-item>
      </form>
    </el-form>
  </div>
</template>
<script>
import { addProductPic, newProduct } from "@/const/api";
export default {
  layout: "seller-layout",
  data() {
    return {
      sizeForm: {
        name: "",
        type: "",
        date1: "",
        date2: "",
        price: "",
        address: "",
        desc: ""
      },
      imageList: [],
      detailImage: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user.id;
    }
  },
  methods: {
    handleRemove1(file, fileList) {
      this.imageList = fileList;
    },
    handleChange1(file, fileList) {
      this.imageList = fileList;
    },
    handleRemove2(file, fileList) {
      this.detailImage = fileList;
    },
    handleChange2(file, fileList) {
      this.detailImage = fileList;
    },
    //上传图片
    submitPic(event) {
      if (
        !this.sizeForm.name ||
        !this.sizeForm.type ||
        !this.sizeForm.date1 ||
        !this.sizeForm.date2 ||
        !this.sizeForm.price ||
        !this.sizeForm.address ||
        !this.sizeForm.desc
      ) {
        this.$message("必填项不能为空");
        return;
      }
      this.$confirm(`您确认创建该商品吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let formData = new FormData(event.target);
        this.$axios.$post(addProductPic, formData).then(res => {
          if (res == "error") {
            this.$message.error("图片上传失败，请稍后再试");
            return false;
          } else {
            this.picList = res;
            this.addProduct();
          }
        });
      });
      return false;
    },
    async addProduct() {
      this.$axios
        .$post(newProduct, {
          user: this.user,
          sizeForm: this.sizeForm,
          images: this.picList
        })
        .then(res => {
          if (res == "success") {
            this.$message.success("商品发布成功");
            this.$router.push({ path: "/seller/selling" });
          } else {
            this.$message.error("商品发布失败，请稍后再试");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="stylus">
.page{
  padding: 14px 340px 4px 50px;
  
}
.cx-shai{
  color #888888
  font-size 12px
  line-height 28px
  padding-top 15px
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
