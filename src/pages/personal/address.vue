<template>
  <div class="safety">
    <div class="main">
      <div class="content">
        <section class="table-container">
          <div class="table-container__title">
            <h4>地址管理</h4>
            <span class="table-container__title__desc">您已创建{{addressList.length}}个地址，最多能够保存10个收货地址</span>
            <el-button :disabled="addressList.length===10" icon="el-icon-plus" class="table-container__title__button" @click="go2new">新增收货地址</el-button>
          </div>
          <div class="table-container__body">
            <div v-for="item in addressList" :key="item.id" class="address-card">
              <div class="address-card__info">
                <p>
                  <label>收货人：</label>
                  <span>{{item.shoujianren}}</span>
                </p>
                <p>
                  <label>手机：</label>
                  <span>{{item.tel}}</span>
                </p>
                <p>
                  <label>邮政编码：</label>
                  <span>{{item.postalCode}}</span>
                </p>
                <p>
                  <label>地址：</label>
                  <span>{{item.address}}</span>
                </p>
              </div>
              <div class="address-card__oper">
                <div v-if="item.default == 1">默认地址</div>
                <el-button type="text" @click="onDeleteAddress(item.addressId)" v-if="item.default == 0">删除</el-button>
              </div>
            </div>
          </div>
          <!-- <div class="pagination">
            <el-pagination
              @current-change="getAddressList"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              prev-text="上一页"
              next-text="下一页"
              :total="total">
            </el-pagination>
          </div> -->
        </section>
      </div>
    </div>

    <el-dialog :title="'新增收货地址'" :visible.sync="editDialogVisible">
      <el-form :model="tempAddress" ref="addressForm" :rules="addressRules" label-width="100px">
        <el-form-item label="是否默认地址">
          <el-radio-group v-model="tempAddress.default">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="shoujianren">
          <el-input v-model="tempAddress.shoujianren"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="tel">
          <el-input v-model="tempAddress.tel" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postalCode">
          <el-input v-model="tempAddress.postalCode" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="tempAddress.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="red-button" @click="commitAddress">确定</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import youzanLocation from "@/const/arealist";
import { getAddressList, deleteAddress, newAddress } from "@/const/api";
import { mobileRule, passwordRule } from "@/const/rules";
// import jdAddressSelect from "@/components/jd-address-select";

export default {
  layout: "personal-layout",
  components: {
    VDistpicker
    // jdAddressSelect
  },
  data() {
    var isPhone = (rule, value, callback) => {
      if (!mobileRule.pattern.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      isEditting: false,
      // currentPage: 1,
      // pageSize: 10,
      // total: 0,
      addressRules: {
        shoujianren: [
          { required: true, message: "请填写收货人姓名", trigger: "blur" }
        ],
        areaName: [{ required: true, message: "请填写地区", trigger: "blur" }],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }],
        deliveryMobile: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          {
            validator: isPhone,
            message: "请填写正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      hasProvince: false,
      hasCity: false,
      hasArea: false,
      editDialogVisible: false,
      tempAddress: {
        userid: 0,
        shoujianren: "",
        tel: "",
        default: 0, //默认为非默认地址
        postalCode: "000000",
        address: ""
      },
      // showAddrSel: false
      addressList: []
    };
  },
  computed: {
    location() {
      return this.$store.state.locationCity;
      // return this.$store.state.locationCityforJD;
    },
    user() {
      return this.$store.state.user.id;
    },
    ...mapState("address", ["defaultStatusId"]),
    ...mapGetters("address", {
      // addressList: "list",
      defaultAddress: "defaultAddress",
      getItem: "getItem"
    })
  },
  created() {
    this.getAddressList();
    // this.findChildAddressByParentAreaId = findChildAddressByParentAreaId;
  },
  methods: {
    getAddressList() {
      this.$axios
        .$get(`${getAddressList}?userid=${this.$store.state.user.id}`)
        .then(res => {
          this.addressList = res.list;
        });
    },
    commitAddress() {
      this.tempAddress.userid = this.user;
      this.$axios.$post(newAddress, this.tempAddress).then(res => {
        if (res != "error") {
          this.$message({
            type: "success",
            message: "创建成功！"
          });
          this.editDialogVisible = false;
          this.getAddressList();
        } else {
          this.$message({
            type: "error",
            message: "创建失败，请稍后重试！"
          });
        }
      });
    },
    go2new() {
      this.tempAddress = {
        shoujianren: "",
        tel: "",
        address: "",
        default: 0, //默认为非默认地址
        postalCode: ""
      };
      this.editDialogVisible = true;
    },
    onDeleteAddress(id) {
      this.$confirm("确定要删除这个收货地址吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // this.$store.dispatch("address/deleteItem", id);
        this.$axios
          .$post(`${deleteAddress}?addressid=${id}`)
          .then(res => {
            if (res != "error") {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.getAddressList();
              return;
            }
            this.$message({
              type: "error",
              message: "删除失败，请稍后重试！"
            });
          })
          .catch(() => {});
      });
    },
    async onSetDefault(id) {
      // let res = await setDefaultAddress(id, { token: this.user.token });
      await this.$store.dispatch("address/setDefaultStatus", id);
    }
    // async onEditInvoice() {},
    // getCodeByName(locationObj, name, isCity) {
    //   let rtnCode = "";
    //   let cityKey = "";
    //   if (isCity) cityKey = name.substring(0, 2);
    //   for (var key in locationObj) {
    //     if (
    //       locationObj[key] == name ||
    //       (isCity && locationObj[key].indexOf(cityKey) != -1)
    //     ) {
    //       rtnCode = key;
    //       break;
    //     }
    //   }
    //   return rtnCode;
    // }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~assets/mixin.styl"
  .pagination
    margin 0
  .table-container
    padding-bottom 12px
  .address-card
    display flex
    justify-content space-between
    border 1px solid $bdGrey
    margin-bottom 16px
    &__info
      padding 12px 12px
      color $textColor
      font-size 13px
      p
        line-height 30px
        label
          display inline-block
          width 100px
          text-align right
    &__oper
      width 140px
      border-left 1px solid $bdGrey
      background-color $bgGrey
      display flex
      flex-direction column
      align-items center
      justify-content center
      & > *
        margin: 0
        padding: 4px 0

  .invoice-area
    margin: 4px 0
    h5
      font-size: 14px
      display: inline-block
      & + span
        font-size: 12px
        color: $red
        padding-left: 16px
    .el-form
      margin: 12px 0;
      &-item
        margin-bottom: 12px
      .el-input
        width: 240px
        /deep/ &__inner
          height: 32px
</style>
