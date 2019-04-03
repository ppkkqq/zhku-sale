<template>
  <div class="page" style="background-color: #fff;">
    <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
      <el-form-item label="商品名称">
        <el-input v-model="sizeForm.name"></el-input>
      </el-form-item>
      <el-form-item label="商品类目">
        <el-select v-model="sizeForm.type" placeholder="请选择商品所属类目">
          <el-option label="配件" value="peijian"></el-option>
          <el-option label="箱包" value="xiangbao"></el-option>
          <el-option label="鞋靴" value="xiexue"></el-option>
          <el-option label="电脑硬件" value="diannao"></el-option>
          <el-option label="家居用品" value="jiaju"></el-option>
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
      <el-form-item label="主图">
        <el-upload
          class="upload-demo"
          action="123"
          :file-list="sizeForm.imageList"
          list-type="picture">
          <el-button size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <p class="cx-shai">最多可上传3张图片，每张图片大小不超过5M，建议用800*800，支持bmp,gif,jpg,png,jpeg格式文件</p>
      </el-form-item>
      <el-form-item label="详情图">
        <el-upload
          class="upload-demo"
          action="123"
          :file-list="sizeForm.image2"
          list-type="picture">
          <el-button size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品介绍">
        <el-input v-model="sizeForm.desc"></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    layout: "seller-layout",
    data() {
      return {
        sizeForm: {
          name: '',
          type: '',
          date1: '',
          date2: '',
          price: '',
          address: '',
          desc: '',
          imageList: [],
          image2: []
        }
      };
    },
    methods: {
      onSubmit() {
        console.log('submit!');
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
</style>
