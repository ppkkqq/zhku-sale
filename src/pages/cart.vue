<template>
  <div class="page cart">
    <index-header></index-header>

    <cart-search-title></cart-search-title>
    <div class="cart-body">
      <div class="cart-header container">
        <span class="num">全部商品 {{cartList&&cartList.length}}</span>
      </div>

      <div class="cart-head container">
        <div class="check-all">
          <el-checkbox-group v-model="allCheckedGoods">
            <el-checkbox label="all"></el-checkbox>
          </el-checkbox-group>
          <div class="check-all-text">全选</div>
        </div>
        <div class="text" style="width: 485px">商品</div>
        <div class="text" style="width: 150px">当前竞价</div>
        <div class="text" style="width: 100px">操作</div>
      </div>

      <el-checkbox-group v-model="allCheckedGoodsSingleShop" >
          <div class="cart-content container">
            <el-checkbox-group class="cart-goods white-bg"
                               v-model="checkedSkuList">
              <div class="cart-item" :key="index1" v-for="(item,index1) in cartList">
                <div class="goods-item">
                  <el-checkbox :label="item.goodid" :key="item.goodid"></el-checkbox>
                  <div class="goods-main" @click="onClickGoods(item, index1)">
                    <!-- v-model="check[index]" @change="handleChange" -->
                    <div class="goods-img">
                <!--<span class="other-status"-->
                      <!--v-if="item.status !== 'on' || item.inventory === 0 || (!item.isSupport && item.shopType!=='SELF')">{{item.status !== 'on' ? '商品已下架' : '商品无货'}}</span>-->
                      <img :src="getPicture+item.pic1 || 'https://osscdn.gtytong.com/assets/images/default-img-normal.png'" width="100" height="100">
                    </div>
                    <div class="goods-content">
                      <div class="goods-title">{{item.name}}</div>
                    </div>
                  </div>
                  <div class="goods-price">{{item.price | price}}</div>
                  <div class="goods-operation">
                    <div class="operation-item" @click="deleteGoods(item.skuId,index1)">
                      <i class="iconfont icon-shanchu-01"></i>
                      <span class="text">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-checkbox-group>
          </div>
      </el-checkbox-group>

      <div class="fixed-wrap" :style="{bottom: diffTop + 'px'}">
        <div class="pay-line container">
          <div class="left-wrap">
            <el-checkbox-group v-model="allCheckedGoods">
              <el-checkbox label="all" style="color: #333">全选</el-checkbox>
            </el-checkbox-group>
            <span class="left-item" @click="deleteSelectGoods">删除选中商品</span>
            <span class="left-item" @click="clearCart">清空购物车</span>
          </div>
        </div>
      </div>
      <div v-if="cartList.length==0" class="empty-box">
        暂无数据
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
  import indexHeader from "@/components/shop-header";
  import cartSearchTitle from "@/components/cart-search-title";
  import indexFooter from "@/components/shop-footer";
  import { confirmOrder } from "@/const/path";
  import { updateQty,cartList,getPicture } from "@/const/api";
  import remove from "lodash/remove";
  import sortBy from "lodash/sortBy";
  import qs from "qs";

  export default {
    name: "cart",
    components: {
      indexHeader,
      indexFooter,
      cartSearchTitle
    },
    data() {
      return {
        cartListloaded: false,
        loadingCartList: false,
        checkAll: false, // 是否全选
        num: [], // mock数量选择
        diffTop: 0,
        check: [],
        skuIdList: [],
        showAddrSel: false,
        isUseLocationCode: false, //是否使用城市定位
        allCheckedSingleShop: [],
        cartList: []//购物车商品列表
      };
    },

    computed: {
      user() {
        return this.$store.state.user;
      },
      allCheckedGoodsSingleShop: {
        //是否全选该商户下商品
        get() {
          const allCheckedGoodsSingleShop = [];
          const shopIdMap = {};
          // 拼接数据
          this.checkedSkuList.map(checkedSkuId => {
            const skuItem = this.getItem(checkedSkuId);
            skuItem &&
            this.$set(shopIdMap, skuItem.shopId, {
              shopId: skuItem.shopId,
              shopName: skuItem.shopName,
              goodsType: skuItem.goodsType,
              // 商品列表，如果不存在就取该商品
              list: (shopIdMap[skuItem.shopId] &&
                shopIdMap[skuItem.shopId].list &&
                shopIdMap[skuItem.shopId].list.concat([skuItem])) || [skuItem]
            });
          });

          // 校验是否选择该店铺下的商品都被选中
          Object.keys(shopIdMap).map(shopId => {
            const targetShop = this.cartListByShop.find(shopItem => {
              return shopItem.shopId === shopId;
            });
            if (shopIdMap[shopId].list.length === targetShop.list.length) {
              allCheckedGoodsSingleShop.push(shopId);
            }
          });
          return allCheckedGoodsSingleShop;
        },
        set(val) {
          this.checkedSkuList = [];
          val.forEach(shopId => {
            const targetShop = this.cartListByShop.find(shopItem => {
              return shopItem.shopId === shopId;
            });

            const skuIdList = targetShop.list.map(goods => {
              return goods.skuId;
            });
            this.checkedSkuList = this.checkedSkuList.concat(skuIdList);
          });
        }
      },
      allCheckedGoods: {
        //是否全选购物车商品
        get() {
          const allCheckedGoods = [];
          if (
            this.checkedSkuList.length === this.cartList.length &&
            this.cartList.length > 0
          ) {
            allCheckedGoods.push("all");
          }
          return allCheckedGoods;
        },
        set(val) {
          const skuIdList = this.cartList.map(goods => {
            return goods.skuId;
          });
          this.checkedSkuList = val.length ? skuIdList : [];
        }
      },
      checkedSkuList: {
        get() {
          return this.getCheckedItems().map(item => {
            return item && item.skuId;
          });
        },
        set(val) {
          this.updateItemsChecked(val);
        }
      },
      location() {
        return this.$store.state.locationCity;
      },
      ...mapState("user", {
        userInfo: state => state
      }),
      ...mapState("cart", ["checkedList"]),
      ...mapGetters("cart", {
        getItem: "getItem",
        getCheckedItems: "getCheckedItems",
        cartListByShop: "cartListByShop"
      }),
      ...mapGetters("address", {
        addressList: "list"
      })
    },
    methods: {
      ...mapActions("user", [
        "addCollection",
        "getCollection",
        "deleteCollection"
      ]),
      ...mapMutations("address", ["setDefault", "setSelectedAddress"]),
      ...mapActions("address", {
        loadAddressList: "loadList"
      }),
      ...mapActions("orders", ["addOrder"]),
      ...mapMutations("cart", [
        "update",
        "updateItemsChecked",
        "add2PlaceOrderItems"
      ]),
      ...mapActions("cart", [
        "updateCollect",
        "updateSkuQuantity",
        "loadList",
        "deleteItemByGroup"
      ]),
      async handleInput({ skuId, quantity }) {
        try {
          // 因为input-number在setValue跟watch value变化都会发input事件
          // 所以需要判断quantity是否与当前商品一致，如一致则无需触发更新接口
          const currentSku = this.getItem(skuId);
          if (currentSku.quantity === quantity) {
            return;
          }
          await this.updateSkuQuantity({ skuId, quantity });
        } catch (e) {
          throw e;
        }
      },
      isSelfSale(item) {
        return item.shopType === "SELF";
      },
      getCart() {
        const loading = this.$loading({
          text: "Loading",
          spinner: "el-icon-loading"
        });
        let query = {
          userid: this.$store.state.user.id,
          page: 1
        }
        this.$axios.$get(`${cartList}?${qs.stringify(query)}`)
          .then(res => {
            this.cartList = res
          })
          .catch(err => {
            if (err.response.status === 401) {
              // 权限问题，统一处理
              return;
            }
            this.$message.error("获取购物车列表失败");
          })
          .finally(() => {
            loading.close();
            this.cartListloaded = true;
            this.cartListLoading = false;
            // 更新一次选中状态
            this.updateItemsChecked(this.checkedSkuList);
          });
      },

      deleteGoods(skuId, index) {
        this.$confirm("是否确认删除")
          .then(res => {
            this.deleteGoodsItem([skuId]);
            done();
          })
          .catch(() => {});
      },
      deleteSelectGoods() {
        if (!this.checkedSkuList.length) {
          this.$message({
            showClose: true,
            message: "请选择商品",
            type: "error"
          });
          return;
        }
        this.$confirm("是否确认删除选中商品")
          .then(res => {
            this.deleteGoodsItem(this.checkedSkuList);
            done();
          })
          .catch(() => {});
      },

      async collectGoods(skuIdList) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading"
        });
        try {
          let rst = await this.$store.dispatch(
            "user/addCollection",
            skuIdList.map(skuId => {
              const goods = this.getItem(skuId);
              return {
                accountId: this.$store.state.user.id,
                shopId: goods.shopId, //店铺id，非必须
                itemId: goods.itemId,
                skuId: goods.skuId,
                productPhoto: (goods.imgUrl && goods.imgUrl.split(",")[0]) || "",
                price: goods.priceMoney,
                name: goods.itemName
              };
            })
          );
          skuIdList.forEach((id, index) => {
            this.updateCollect({ skuId: id, isCollect: rst[index].id });
          });
          this.$message({
            showClose: true,
            message: "收藏成功",
            type: "success"
          });
        } catch (e) {
          this.$message({
            showClose: true,
            message: "收藏失败，请稍后再试",
            type: "error"
          });
        }

        loading.close();
      },

      collectGoodsItem(item) {
        this.collectGoods([item.skuId]);
      },

      // 选中商品加入我的收藏
      async collectSelectGoods(val) {
        if (!this.checkedSkuList.length) {
          this.$message({
            showClose: true,
            message: "请选择商品",
            type: "error"
          });
          return;
        }
        this.collectGoods(this.checkedSkuList);
      },
      async deleteGoodsItem(skuIdList) {
        let ids = { skuIdList: skuIdList };

        this.deleteItemByGroup(ids)
          .then(resp => {
            remove(this.checkedSkuList, skuId => {
              return skuIdList.find(id => {
                return skuId === id;
              });
            });
          })
          .catch(() => {});
      },

      async clearCart(val) {
        this.$confirm("是否确认清空购物车")
          .then(res => {
            let ids = { skuIdList: [] };
            this.cartList.forEach(item => {
              ids.skuIdList.push(item.skuId);
            });

            this.deleteItemByGroup(ids)
              .then(resp => {
                this.checkedSkuList = [];
              })
              .catch(() => {});
            done();
          })
          .catch(() => {});
        // this.$store.dispatch("cart/deleteItemByGroup", ids);
      },


      fixedScroll() {
        var scrollT =
          document.body.scrollTop || document.documentElement.scrollTop; //兼容处理
        var currtTop = document.documentElement.clientHeight + scrollT;
        var footerHeight = document.getElementsByClassName("main-footer")[0]
          .offsetHeight;
        if (currtTop >= document.body.scrollHeight - footerHeight) {
          this.diffTop = footerHeight - (document.body.scrollHeight - currtTop);
        } else {
          this.diffTop = 0;
        }
      },
      closeTab() {
        this.showAddrSel = false;
      },
      onClickGoods(item) {
        // 已下架商品不可跳转
        // if (item.status !== "on") {
        //   return;
        // }

        this.$router.push({
          path: "/detail",
          query: {
            id: item.goodid,
          }
        });
      },
      isItemActive(item) {
        // 返回商品是否是有效状态
        return !(item.status !== "on" || item.inventory === 0 || !item.isSupport);
      }
    },
    async mounted() {
      // window.that = this;
      // 解决滚动条触底问题
      window.addEventListener("scroll", this.fixedScroll, false);
      // 加载默认地址
      this.loadAddressList();
      this.getCart();
      // this.initDeliveryCity();
    },
    created() {
      this.sortBy = sortBy;
      this.getPicture = getPicture;
    },

    beforeDestroy() {
      window.removeEventListener("scroll", this.fixedScroll, false);
    }
  };
</script>
<!-- no scoped版本 -->
<style lang="stylus">
  // 隐藏checkbox label
  .cart .el-checkbox__label {
    display: none;
  }
  .empty-box {
    width 100%
    height 150px
    text-align center
    vertical-align middle
    line-height 150px
    font-size 16px
  }
  .cart .other-status {
    position absolute
    text-align center
    width 80px;
    height 80px;
    line-height 80px;
    border-radius 50%;
    background-color rgba(136, 136, 136, .9);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color #fff;
    font-size 14px;
  }
</style>
<style scoped lang="stylus">
  @import '~assets/mixin.styl';

  .attention-tag {
    border: #F49824 1px solid;
    border-top: none;
    color: #F49824;
    height: 24px;
    font-size: 12px;
    text-align: center;
    background: #FEF2DC;
    font-weight: bold;
  }
  .page {
    background: #fff;
  }

  .cart-header {
    position: relative;
    .num {
      font-size: 18px;
      color: $primary-start;
    }
  }
  .store-info{
    display: flex;
    flex-direction: row;
    padding: 20px 14px;
    .check-whole-store{
      padding-right: 10px;

    }
    .store-name{
      padding-right: 8px;
      font-size:15px;
      font-family:PingFangSC-Medium;
      font-weight:500;
    }
    .self-operated{
      font-size:12px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,255,255,1);
      background-color: $dark-red;
      padding: 2px 5px;
      border-radius:3px;
    }
  }
  .cart-footer{
    text-align: center;
  }
  .select-address {
    position: absolute;
    top: 0px;
    right: 0px;
    .selected-address {
      display: inline-block;
      padding-right: 4px;
      line-height: 28px;
      color: #333;
      font-size: 15px;
      cursor: pointer;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(204, 204, 204, 1);
      span {
        margin: 0 2px 0 10px;
      }
    }
    .address_warp {
      right: 0;
      left: unset !important;
    }
  }


  .cart-head {
    flexCenter();
    justify-content: space-between;
    margin-top: 12px;
    height: 40px;
    background: #f5f5f5;
    padding: 0 40px;
    color: #333;

    .text {
      text-align: center;
    }
    .check-all{
      display flex
      flex-direction row
      .check-all-text{
        padding-left: 10px;
      }
    }
  }

  .cart-content {
    //margin-bottom: 110px;
  }
  .cart-body{
    min-height 550px;
    padding-bottom 60px
  }
  .cart-item {
    // margin-top: 20px;

    .shop-title {
      flexCenter();
      padding-left: 14px;
      margin-bottom: 10px;

      .shop-name {
        font-size: 15px;
        color: #333;
        margin: 0 8px 0 12px;
      }

      .float {
        flexCenter();
        justify-content: center;
        padding: 2px 6px;
        line-height: 12px;
        background: rgba(252, 15, 61, 1);
        border-radius: 3px;
        font-size: 12px;
        color: #fff;
      }
    }
  }

  .goods-item {
    flexCenter();
    justify-content: space-between;
    height: 140px;
    padding: 20px 40px;
    border: 1px solid #e6e6e6;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .goods-main {
      cursor: pointer;
      flexCenter();
    }

    .goods-img {
      // border: 1px solid #e6e6e6;
      position: relative;
      /*margin-left: 16px;*/
      wh(100px, 100px);
      margin-right: 20px;
    }

    .goods-content {
      flexCenter(flex-start, column);
      justify-content: space-between;
      wh(370px, 100px);
      margin-left: 14px;

      .goods-title {
        font-size: 15px;
        color: #333;
        span {
          border-radius:5px;
          font-size: 12px;
          background-color: #F49824;
          padding: 3px 8px;
          color: white;
          margin-right: 5px;
        }
      }

      .goods-type {
        font-size: 15px;
        color: #999;
      }

      .goods-serve {
        font-size: 13px;

        .iconfont {
          font-size: 13px;
        }

        .text {
          font-size: 13px;
        }
      }
    }

    .goods-price {
      font-size: 15px;
      color: #666;
      width: 150px;
      text-align: center;
      margin-left: -2px;
    }

    .goods-num {
      width: 130px;
      margin-left: 12px;
    }

    .goods-count-price {
      font-size: 15px;
      color: #1a1a1a;
      font-weight: bold;
      width: 150px;
      text-align: center;
    }

    .goods-operation {
      flexCenter(center, column);
      justify-content: center;
      width: 100px;

      .operation-item {
        margin: 8px 0;
        color: #666;
        cursor: pointer;
        font-size: 14px;
        .iconfont {
          color: #999;
        }
      }

      .operation-item:active {
        color: $primary-start;

        .iconfont {
          color: $primary-start !important;
        }
      }
    }
  }

  .fixed-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    background: #fff;
    z-index: 100;

    &.isBottom {
      bottom: 169px;
    }

    .pay-line {
      flexCenter();
      justify-content: space-between;
      height: 60px;

      .left-wrap {
        flexCenter();

        .left-item {
          font-size: 15px;
          color: #333;
          margin-left: 40px;
          cursor: pointer;
        }

        & /deep/ .el-checkbox {
          flexCenter();
        }

        & /deep/ .el-checkbox__label {
          font-size: 15px;
          color: #333;
        }
      }

      .right-wrap {
        flexCenter();
        font-size: 15px;
        color: #333;

        .right-item {
          flexCenter();
          margin-left: 40px;

          .price {
            color: $primary-start;
            font-size: 20px;
            margin-left: 4px;
          }

          .red {
            margin: 0 8px;
          }
        }

        .pay-btn {
          margin-left: 30px;
          wh(100px, 60px);
          text-align: center;
          line-height: 60px;
          color: #fff;
          background: $primary-start;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .little-top {
    top: 30px!important
  }
</style>
