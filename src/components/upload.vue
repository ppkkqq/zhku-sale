<template>
  <div class="upload-to-qiniu">
    <div class="upload-area" :class="{disabled: disabled}" @click="selectFile">
      <!--@slot 自定义上传内容-->
      <slot>
        <!--默认内容，实现展示图片-->
        <!--自定义slot需要自己实现图片展示和进度-->
        <div class="upload-default-box">
          <div v-if="type === 'img' && fileUrl" class="upload-img-box">
            <div class="img-mask">
              <i class="icon-del" @click.stop.prevent="delImg" v-if="showDel">X</i>
            </div>
            <img :src="fileUrl" class="upload-img" />
          </div>
          <div class="upload-placeholder" v-else>
            点击上传
          </div>
        </div>
      </slot>
    </div>
    <input type="file" ref="uploadInput" class="upload-input" @change="upload" hidden :accept="accept"
           :multiple="multiple">
  </div>
</template>

<script>
import AliOSS from "ali-oss";
// require('../../node_modules/image-compressor/image-compressor.js') // 此库用法错误，上传报错，暂行禁用
// import ImageCompressor from "image-compressor.js"; // 这么写根本用不了。该库非标准 CMD，Nuxt 会报错。

// const imageCompressor = new ImageCompressor();

export default {
  name: "Upload",
  props: {
    /**
     * 重要配置说明, 使用前请务必设置跨域 及 ACL
     * @link https://help.aliyun.com/document_detail/32069.html?spm=a2c4g.11186623.6.920.9ddd5557vJ6QU7
     */
    accessKeyId: {
      type: String,
      default: "LTAIanALXlCW3xN9"
    },
    /**
     */
    accessKeySecret: {
      type: String,
      default: "sRQAhvfb6uMmzVvqwynQn3DJi4NtIl"
    },
    /**
     * 存储空间的名字
     */
    bucket: {
      type: String,
      default: "gtytoss"
    },
    /**
     * 根据 存储空间 所在的存储区域, 相应的上传域名
     */
    region: {
      type: String,
      default: "oss-cn-hangzhou"
    },
    /**
     * 目录名
     */
    dir: {
      type: String,
      default: "mobile"
    },
    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
     * 上传文件大小限制, 默认1MB, 参考GitHub上传头像设置
     * @link https://github.com/settings/profile
     */
    limit: {
      type: Number,
      default: 1024 * 1024
    },
    /**
     * 接受上传的文件类型, 多个值逗号分隔, 默认只接受图片
     * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
     */
    accept: {
      type: String,
      default: "image/png, image/jpeg, image/gif, image/jpg"
    },
    /**
     * 超时时间, 单位毫秒, 大于0才生效
     */
    timeout: {
      type: Number,
      default: 0
    },
    /**
     * 默认文件的路径
     */
    fileUrl: {
      type: String,
      default: ""
    },
    /**
     * 上传文件类型
     * 默认 img
     * 可选 file
     */
    type: {
      type: String,
      default: "img"
    },
    /**
     * 是否禁用上传组件的鼠标事件，
     * 若为true，不能上传
     */
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 是否展示删除图标
     * 默认为false，不展示
     */
    showDel: {
      type: Boolean,
      default: false
    },
    /**
     * 索引
     */
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      client: {},
      uploading: false,
      files: []
    };
  },
  mounted() {
    if (
      !this.region ||
      !this.bucket ||
      !this.accessKeyId ||
      !this.accessKeySecret
    ) {
      console.error(
        "必要参数不能为空: region bucket accessKeyId accessKeySecret"
      );
      return;
    }

    this.newClient();
  },
  methods: {
    newClient() {
      // https://help.aliyun.com/document_detail/32069.html?spm=a2c4g.11186623.6.801.LllSVA
      this.client = new AliOSS({
        region: this.region,
        bucket: this.bucket,
        // FIXME danger!
        accessKeyId: this.accessKeyId,
        accessKeySecret: this.accessKeySecret
      });
    },
    delImg() {
      /**
       * 删除图片操作
       * @event delImg
       */
      this.$emit("delete");
    },
    selectFile() {
      this.$refs.uploadInput.click();
    },
    async upload(e) {
      let files = e.target.files;
      console.log("inside upload.vue:");
      console.log(files);
      const reset = () => (e.target.value = "");

      if (!files.length) return;

      this.uploading = true;

      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        let name = file.name;
        let key = "";

        this.$message.info({ message: name + " 上传中..." });

        // file = await imageCompressor.compress(file, { maxWidth: 750 });

        //文件名-时间戳 作为上传文件key
        let pos = name.lastIndexOf(".");
        let suffix = "";
        if (pos != -1) {
          suffix = name.substring(pos);
        }

        key = `${name.substring(0, pos)}-${new Date().getTime()}${suffix}`;

        const options = {
          //          progress: this.progress,
          partSize: 100 * 1024,
          meta: {
            year: 2018,
            people: "test"
          }
        };

        await this.client
          .multipartUpload(this.dir + "/" + key, file, options)
          .then(res => {
            this.files.push(
              `https://${this.bucket}.${this.region}.aliyuncs.com/${res.name}`
            );
          })
          .catch(err => {
            reset();
            this.uploading = false;

            // 捕获超时异常
            if (e.code === "ConnectionTimeoutError") {
              this.$message.error({
                message: "上传超时"
              });
            }
            if (this.client.isCancel()) {
              this.$message.warning({
                message: "上传已取消"
              });
            } else {
              this.$message.error({
                message: "上传失败"
              });
            }
          });

        this.newClient();
      }

      this.$message.success({
        message: "上传成功",
        duration: 1000
      });

      // 上传单张 返回 String
      // 上传多张 返回 Array
      let result = this.multiple ? this.files : this.files[0];
      this.$emit("load", { result: result, index: this.index });

      reset();
      this.uploading = false;
      this.files = [];
    }
  }
};
</script>
<style>
.disabled {
  pointer-events: none; /*禁用所有鼠标事件*/
}
.upload-default-box {
  overflow: hidden;
  width: 80px;
  height: 80px;
  color: #ccc;
  border: 1px dashed #ccc;
}
.upload-img-box {
  position: relative;
}
.upload-img-box .img-mask {
  display: none;
  position: absolute;
  height: 100%;
  width: 100%;
}
.upload-img-box:hover .img-mask {
  display: block;
}
.upload-img-box:hover .icon-del {
  display: block;
}

.upload-img-box .icon-del {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
}
.upload-img-box .icon-del:hover {
  font-size: 20px;
  color: red;
}
.upload-placeholder {
  text-align: center;
}
.upload-img {
  width: 100%;
  display: block;
}
.upload-input {
  display: none;
}
.upload-area {
  cursor: pointer;
}
</style>
