<template>
  <div class="pages goods-detail" style="background: white;">
    <main-header id="top"></main-header>
    <div class="content">
      <div class="left">
        <div class="info">
          <div class="breadcrumb-block">
            <div v-if="isLogin" class="shop-cart-btn" @click="gotoCart()">
              <span class="car-icon"></span>
              <span class="text" >我的购物车</span>
              <span class="float" v-show="showNumber">{{showNumber}}</span>
            </div>
          </div>
          <div class="info-box">

            <div class="imgs">
              <img class="main-img" :src="photoes[subSelected]">
              <div class="img-selector">
                <img class="sub-img" :class="{ 'sub-selected': subSelected === index }" v-for="(item,index) in photoes" :key="item" @click="subSelected = index" :src="item"/>
              </div>
            </div>

            <div class="goods">
              <div class="goods-name">{{goodsDetail.name}}</div>
              <div class="goods-content">{{goodsDetail.content}}</div>
              <div class="goods-selector">
                <div class="row">
                  <span class="title">当 前 价：</span>
                  <span class="count">{{goodsDetail.price | price }}</span>
                </div>
                <div class="row">
                  <span class="title">距离结束：</span>
                  <countdown :time="leftTime"
                             :auto-start="true"
                             v-if="goodsDetail.lasttime > 0">
                  <template slot-scope="props">
                    <span v-if="props.days>0" class="blod-font">{{props.days}}</span>天
                    <span class="blod-font">{{props.hours}}</span>时
                    <span class="blod-font">{{ props.minutes }}</span>分
                    <span class="blod-font">{{ props.seconds }}</span>秒
                  </template>
                </countdown>
                </div>
                <div class="row">
                  <span class="title">出　价：</span>
                  <el-input-number v-model="myPrice" :precision="2" :step="input2price || 0.01" :min="goodsDetail.price*1+0.01"></el-input-number>
                  <span>　价 格 跨 度：<el-input v-model="input2price" placeholder="输入跨度" style="width:110px" :maxlength="4" type="number"></el-input></span>
                </div>
              <div class="buttons">
                <button class="buy" @click="commitNewPrice">立即出价</button>
                <button class="cart"  @click="addtoCart">加入购物车</button>

              </div>
            </div>
            </div>
          </div>
        </div>
        <div class="comment" v-show="showIntro1">
          <div class="segments">
            <div class="segment-selected" @click="goIntroduce('1')">商品介绍</div>
            <div class="segment" @click="goIntroduce('2')">竞价记录</div>
            <div class="segment" @click="goIntroduce('3')">买家评价</div>
            <div class="segment" @click="goIntroduce('4')">联系卖家</div>
          </div>
          <div class="cards full-width" style="width: 800px;padding: 14px 30px;">
            <div style="margin: 6px 0 20px;">商品所在地址: {{goodsDetail.address}}</div>
            <img :src="getPicture+goodsDetail.picture">
          </div>
        </div>
        <div class="comment" v-show="showIntro2">
          <div class="segments">
            <div class="segment" @click="goIntroduce('1')">商品介绍</div>
            <div class="segment-selected" @click="goIntroduce('2')">竞价记录</div>
            <div class="segment" @click="goIntroduce('3')">买家评价</div>
            <div class="segment" @click="goIntroduce('4')">联系卖家</div>
          </div>
          <div class="cards full-width" style="width: 990px;">
            <el-table
              :data="tableData2"
              stripe
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column
                width="100"
              >
              </el-table-column>
              <el-table-column
                label="状态"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.state==1 ? '领先':'出局' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="user"
                label="竞买号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="myPrice"
                label="价格"
                width="180">
              </el-table-column>
              <el-table-column
                label="出价时间">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="comment" v-show="showIntro3">
          <div class="segments">
            <div class="segment" @click="goIntroduce('1')">商品介绍</div>
            <div class="segment" @click="goIntroduce('2')">竞价记录</div>
            <div class="segment-selected" @click="goIntroduce('3')">买家评价</div>
            <div class="segment" @click="goIntroduce('4')">联系卖家</div>
          </div>
          <div class="cards"  v-if="commentList.length">
            <div class="card" v-for="(item,index) in commentList" :key="index">
              <div class="user">
                <img :src="getPicture + 'default-img-big.png'" alt="user">
                <div style="margin-left: 10px;"> {{item.user}}</div>
              </div>
              <div class="comment-content">
                <el-rate
                  v-model="item.grade"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
                <span class="content-desc"> {{item.commentContent}}</span>
                <div class="content-imgs" v-if="item.pic1">
                  <viewer class="view" v-if="item.commentPic1"
                          :height="'60px'" :width="'60px'" :src="getPicture+item.commentPic1"/>
                  <viewer class="view" v-if="item.commentPic2"
                          :height="'60px'" :width="'60px'" :src="getPicture+item.commentPic2"/>
                  <viewer class="view" v-if="item.commentPic3"
                          :height="'60px'" :width="'60px'" :src="getPicture+item.commentPic3"/>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination" v-if="commentList.length">
            <button class="pre" :class="{death: page === firstPage}" @click="page = --page < firstPage ? firstPage : page"><i class="el-icon-arrow-left"></i>上一页</button>
            <button v-if="page - 3>=firstPage" @click="page = firstPage">{{firstPage}}</button>
            <span v-if="page - 3>firstPage">...</span>
            <button v-if="page - 2>=firstPage" @click="page = page - 2">{{page - 2}}</button>
            <button v-if="page - 1>=firstPage" @click="page = page - 1">{{page - 1}}</button>
            <button class="current" @click="page = page">{{page}}</button>
            <button v-if="page + 1<=lastPage" @click="page = page + 1">{{page + 1}}</button>
            <button v-if="page + 2<=lastPage" @click="page = page + 2">{{page + 2}}</button>
            <span v-if="page + 3<lastPage">...</span>
            <button v-if="page + 3<=lastPage" @click="page = lastPage">{{lastPage}}</button>
            <button class="next" :class="{death: page === lastPage}" @click="page = ++page > lastPage ? lastPage : page">下一页<i class="el-icon-arrow-right"></i></button>
          </div>
        </div>
        <div class="comment" v-show="showIntro4">
          <div class="segments">
            <div class="segment" @click="goIntroduce('1')">商品介绍</div>
            <div class="segment" @click="goIntroduce('2')">竞价记录</div>
            <div class="segment" @click="goIntroduce('3')">买家评价</div>
            <div class="segment-selected" @click="goIntroduce('4')">联系卖家</div>
          </div>
          <div class="cards full-width" style="width: 990px;" v-html="goodsDetail.detail"></div>
        </div>

      </div>
      <div class="history">
        <h6>浏览历史</h6>
        <div v-if="!history.length" style="border: 0;color: #999;margin-top: 30px;">
          暂无历史记录
        </div>
        <div class="card0" v-for="item in history"  @click="detailLink(item)">
          <img :src="getPicture+item.pic1">
          <!--<span>{{item.name}}</span>-->
          <span class="count">{{item.price | price}}</span>
        </div>
      </div>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
import { formatDate } from "@/const/filter";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import mainHeader from "@/components/index-header";
import jdAddressSelect from "@/components/jd-address-select";
import addressSelect from "@/components/address-select";
import indexFooter from "@/components/shop-footer";
import {
  goodsDetail,
  addCart,
  categoryTree,
  getHistory,
  findChildAddressByParentAreaId,
  getDetailById,
  getPicture,
  getBabyRecord,
  commitNewPrice,
  add2cart,
  addHistory,
  commentList
} from "@/const/api";
import qs from 'qs'
import Viewer from "viewer";
import SkuSelect from "@/components/sku/SkuSelect";
import SkuStepperStock from "@/components/sku/sku-stepper-stock";
import SkuActions from "@/components/sku/DemoActions";
import { getSkuResultGroup } from "@/components/sku/utils";
import VCollection from "@/components/collection";
import { convert } from "@/utils/sku";
import { changeData } from "@/const/filter";
import { confirmOrder, cart } from "@/const/path";
import Countdown from "@xkeshi/vue-countdown";
const defaultDetailPhoto =
  getPicture + "default-img-big.png";

export default {
  components: {
    mainHeader,
    indexFooter,
    addressSelect,
    jdAddressSelect,
    SkuSelect,
    SkuActions,
    SkuStepperStock,
    Countdown,
    VCollection,
    Viewer
  },
  data() {
    return {
      page: 1,
      subSelected: 0,
      colorSelected: 0,
      sizeSelected: 0,
      pageSelected: 0,
      showIntro1: true,
      showIntro2: false,
      showIntro3: false,
      showIntro4: false,
      goodsDetail: {
        fullName: ""
      },
      history: [],
      photoes: [defaultDetailPhoto],
      showAddrSel: false,

      resultSku: {},
      assistForm: {},
      sku: { list: [], tree: [] },
      quantity: 1,
      maxStock: 0,
      skuPrice: null,
      initialSku: {},
      showNumber: "",

      address: [],
      defaultCollectedIds: [],
      defaultCollectedIdsMap: [],
      defaultCollectedStatus: false,
      loaded: false,
      loadNewGoods: true, // 是否加载新商品
      lowNum: 0, //显示小图右index
      highNum: 5, //显示小图左index
      tableData2: [{
        date: '',
        user: '',
        state: 0,
        price: 0
      }],
      myPrice: 1.00,
      input2price: null,
      leftTime: 0,
      timer: null,//定时器
      score: 4.8,//评分
      commentList: []
    };
  },
  created() {
    this.getGoodsDetail();
    this.getRecord();
    clearInterval(this.timer);
    this.setTime();
    this.formatDate = formatDate;
    this.getPicture = getPicture;
    this.findChildAddressByParentAreaId = findChildAddressByParentAreaId;
    this.getCommentList();
  },
  watch: {
    page() {
      this.loadComment({ goodId: this.productId, page: this.page });
    },
    quantity(val) {
      if (this.totalStock < val) {
        this.quantity = this.totalStock;
      }
    },
    $route: function(to, from) {
      //从一个详情跳转至另一个详情
      if (to.name == "shop-detail" && to.query.id !== from.query.id) {
        const location = this.selectedAddress;
        this.loadNewGoods = true;
        this.getCollectInfo();
      }
    },
    subSelected() {
      if (this.subSelected >= this.highNum) {
        this.lowNum += 5;
        this.highNum += 5;
      } else if (this.subSelected < this.lowNum) {
        this.highNum -= 5;
        this.lowNum -= 5;
      }
    }
  },
  computed: {
    productId() {
      return this.$route.query.id;
    },
    ...mapGetters("user", ["isLogin"]),
    ...mapState("user", {
      userInfo: state => state
    }),
    ...mapState("comments", [
      "totalElements",
      "firstPage",
      "lastPage"
    ]),
    ...mapGetters("address", {
      addressList: "list"
    })
  },
  methods: {
    getCommentList() {
      this.$axios.$get(`${commentList}?goodid=${this.productId}`)
        .then( res => {
          if (res != 'error'){
            this.commentList = res;
          }
        })
        .catch()
    },
    //给竞价表格设置样式
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'success-row';
      }
      return '';
    },
    //给竞价记录设置定时器
    setTime() {
      this.timer = setInterval(() =>{
        this.$axios.$get(`${getBabyRecord}?goodid=${this.productId}`)
          .then(res => {
            this.tableData2 = res;
            this.goodsDetail.price = this.tableData2[0].myPrice;
          })
      },10000);
    },
    closeTab() {
      this.showAddrSel = false;
    },
    // 获取收藏信息
    async getCollectInfo() {
      let payload = await this.getCollection({
        accountId: this.userInfo.id,
        itemId: this.productId
      });

      let collectItem = (payload && payload.content) || [];
      this.defaultCollectedIdsMap = collectItem.map(it => {
        return {
          itemId: it.itemId,
          collectId: it.id
        };
      });
      this.defaultCollectedIds = collectItem.map(it => it.itemId);

      this.defaultCollectedStatus = collectItem.length > 0;
    },

    async getGoodsDetail() {
      const loading = this.$loading({
        // lock: true,
        text: "Loading",
        spinner: "el-icon-loading"
      });
      const rst = this.$axios.$get(`${getDetailById}?id=${this.productId}`);
      rst
        .then(resData => {
          this.goodsDetail = resData;
          this.leftTime = this.goodsDetail.lasttime * 1000 - new Date().getTime()
          this.myPrice = this.goodsDetail.price

          if (!!this.goodsDetail.pic1) {
            this.photoes.length = 0;
            this.$set(this.photoes, '0', getPicture + this.goodsDetail.pic1);
          }
          if(!!this.goodsDetail.pic2){
            this.$set(this.photoes, '1', getPicture + this.goodsDetail.pic2);
          }
          if(!!this.goodsDetail.pic3){
            this.$set(this.photoes, '2', getPicture + this.goodsDetail.pic3);
          }
        })
        .catch(err => {
          const msg =
            (err.response.data && err.response.data.payload) ||
            "服务器繁忙，请稍后再试";
          this.$message({
            showClose: true,
            message: msg
          });
        })
        .finally(() => {
          loading.close();
          if (this.loadNewGoods) {
            //加载新商品，才加载评论，和浏览历史
            this.loadComment({ goodId: this.id, page: this.page });
            this.getHistory();
          }
          this.loadNewGoods = false;
        });
    },
    getCollectData() {
      return [
        {
          accountId: this.userInfo.id, //会员id，必须
          shopId: this.goodsDetail.shopId, //店铺id，非必须
          shopName: "", //店铺名称，非必须
          itemId: this.goodsDetail.id, //商品id，必须
          skuId: this.goodsDetail.skuId, //skuId，非必需
          type: this.goodsDetail.goodsType, //商品类型，非必须
          name: this.goodsDetail.name, //商品名称，必须
          price: this.goodsDetail.lowerSellPrice, //商品价格，必须
          productPhoto: this.photoes[0], //商品图片，必须
          remark: "" //备注，非必须
        }
      ];
    },
    getCancelCollectId() {
      return [this.defaultCollectedIdsMap[0].collectId];
    },
    getHistory() {
      if (!this.isLogin) {
        return
      }
      this.$axios
        .$get(`${getHistory}?userid=${this.$store.state.user.id}
          &goodid=${this.productId}`)
        .then(res => {
          if (res != 'error') {
            this.history = res;
          }
        });
      //将当前商品存入历史记录
      this.$axios.$post(addHistory,{
        userid: this.$store.state.user.id,
        goodid: this.productId
      })
        .then(res => {
          console.log(1212,res)
        })
    },
    gotoCart() {
      this.$router.push({ path: "/cart" });
    },
    goIntroduce(index) {
      if (index == 1) {
        this.showIntro1 = true;
        this.showIntro2 = false;
        this.showIntro3 = false;
        this.showIntro4 = false;
      } else if (index == 2) {
        this.showIntro2 = true;
        this.showIntro1 = false;
        this.showIntro3 = false;
        this.showIntro4 = false;
      } else if (index == 3) {
        this.showIntro3 = true;
        this.showIntro1 = false;
        this.showIntro2 = false;
        this.showIntro4 = false;
      } else if (index == 4) {
        this.showIntro4 = true;
        this.showIntro1 = false;
        this.showIntro2 = false;
        this.showIntro3 = false;
      }
    },

    async addtoCart() {
      if (!this.isLogin) {
        this.$message.error('您还未登录哦')
        return
      }
      this.$confirm(`您确认将该商品加入购物车吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.$post(add2cart,{
            user: this.isLogin,
            goodid: this.productId
          })
            .then(res => {
              console.log(222,res)
              if (res == 'error') {
                this.$message.error('加入购物车失败，请稍后重新操作！')
              }else if(res == 'error2') {
                this.$message.info('购物车已经存在该商品！')
              }else {
                this.$message.success('加入购物车成功！')
              }
            })
        })
        .catch(()=>{})
    },
    showMessage(msg, type = "default") {
      this.$message({
        showClose: true,
        message: msg,
        type: type
      });
    },

    validate() {
      if (!this.isSkuSelected) {
        this.$message("请选择商品规格");
        return false;
      }

      return true;
    },
    async toPay() {
      if (!this.isLogin) {
        const fullPath = this.$route.fullPath; //带query
        this.go2Login(fullPath);
        return;
      }
      this.payLoading = true;
      const loading = this.$loading({
        // lock: true,
        text: "Loading",
        spinner: "el-icon-loading"
      });
      try {
        // debugger;
        const resp = await this.addOrder({
          address: this.selectedAddress,
          isPreOrder: true,
          skuList: [
            {
              skuId: this.resultSku.id,
              quantity: this.quantity,
              categoryId: this.resultSku.categoryId,
              markingId: this.goodsDetail.markingId,
              markingType: this.goodsDetail.markingType
            }
          ],
          isCart: false,
        });

        this.$router.push({
          path: confirmOrder,
          query: {
            preId: resp.id
          }
        });
      } catch (err) {
        const msg =
          (err.response.data && err.response.data.payload) || "立即出价失败";
        this.$message.error(msg);
      } finally {
        loading.close();
        this.payLoading = false;
      }
    },
    detailLink(item) {
      // document.getElementById("top").scrollIntoView({ behavior: "smooth" });
      this.$router.push({
        path: "/detail",
        query: {
          id: item.goodid,
        }
      });
      location.replace()
    },
    onSelectSku(selectedSku, final) {
      this.assistForm = { ...selectedSku };

      if (final && final.final) {
        this.resultSku = final.final;
        this.skuPrice = final.final.price;
      } else {
        this.resultSku = {};
        this.skuPrice = null;
      }
      this.maxStock = this.resultSku.stock_num;
    },

    jump2goodsList() {
      this.$router.push({
        path: "/serchShop",
        query: {
          markingId: this.goodsDetail.markingId,
          markingType: this.goodsDetail.markingType
        }
      });
    },
    jump2goods() {
      this.$router.push({
        path: "/shop/detail",
        query: {
          id: this.goodsDetail.countGoodId
        }
      });
    },
    getRecord() {
      this.$axios.$get(`${getBabyRecord}?goodid=${this.productId}`)
        .then(res => {
          this.tableData2 = res;
        })
    },
    //出价
    commitNewPrice() {
      if (!this.isLogin) {
        this.$message.error('登录后才能出价哦')
        return
      }
      this.$confirm(`您确认出价${this.myPrice}元吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.$post(commitNewPrice,{
            user: this.isLogin,
            goodid: this.productId,
            mypri: this.myPrice
          })
            .then(res => {
              console.log(222,res)
              if (res == 'error') {
                this.$message.error('出价失败，请稍后重新操作！')
              }else {
                this.$message.success('出价成功！')
              }
            })
        })
        .catch(()=>{})
    },
    ...mapMutations("cart", {
      add2PlaceOrderItems: "add2PlaceOrderItems",
      updateCart: "update"
    }),
    ...mapMutations("address", ["setDefault", "setSelectedAddress", "update"]),
    ...mapActions("cart", ["add2Cart", "productCount"]),
    ...mapActions("address", {
      loadAddressList: "loadList"
    }),
    ...mapActions("orders", ["addOrder"]),
    ...mapActions("comments", ["loadComment"]),
    ...mapActions("user", [
      "addCollection",
      "getCollection",
      "deleteCollection",
      "go2Login"
    ]),
  },
  async mounted() {
    // 加载地址
    this.loadAddressList();
    this.getCollectInfo();
    this.showNumber = await this.productCount();
  },
  distroyed() {
    clearInterval(this.timer)
  }
};
</script>



<style lang='stylus'>
  $buttonColor= #0f4511;

  .goods-detail {
    .attention {
      max-width: 140px ;
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      margin-left: 95px;
      color: #333333;
      background-color: #F5F5F5;
      border 1px #CCCCCC solid
      .attention-icon {
        padding: 4px 5px 1px 5px;
        border-right 1px #CCCCCC solid
      }
      .attention-text {
        padding: 4px 10px 0 10px ;
        font-size: 13px;
        font-weight: bold;
      }
    }
    .full-width {
      img {
        width: 100%;
      }
    }
    .sku-title {
      margin-top: 10px;
    }
    .sku-row-items {
      font-size: 0;
      margin-bottom: 20px;
      .sku-row-item {
        height: auto;
        min-width: 100px;
        min-height: 34px;
        line-height: 34px;
        display: inline-block;
        margin: 10px 12px 8px 0;
        font-size: 14px;
        background-color: #fefefe;
        border: 1px solid #ccc
        /*border-radius: 17px;*/
        text-align: center;
        &:active {
          background-color: #fefefe;
          color: #000;
        }
        &:hover {
          color: #0f4511;
        }
        &:before {
          background-color: transparent;
        }
      }
      .sku-row-item-active {
        color: #0f4511;
        border-color: #0f4511;
        &:after {
          border-color: #0f4511;
        }
      }
      .sku-row-item-disabled {
        border dashed 1px #ccc
        color: rgba(0, 0, 0, 0.3);
      }
    }

    button:focus {
      outline: none;
    }
    .content {
      display: flex;
      margin-left: calc(50% - 620px);
      width: 1240px;
      margin-bottom: 30px;
    }
    .left {
      padding-right: 24px;
      border-right: 1px solid rgba(230, 230, 230, 1);
      .info {
        color: #1a1a1a;
        margin-bottom: 30px;
        .breadcrumb-block {
          padding-top: 30px;
          position relative
          .breadcrumb {
            display inline-block
            color #999
            line-height 12px
            margin 16px 0 14px
            .current {
              color: #1a1a1a;
            }
          }
          .shop-cart-btn {
            display inline-block
            top 1px
            right 0px
            position absolute
            line-height 35px
            flexCenter()
            justify-content center
            width 120px
            height 36px
            background rgba(255, 255, 255, 1)
            border 1px solid rgba(224, 224, 224, 1)
            color #888
            cursor pointer
            transition all linear .2s
            &:hover {
              border-color $red
            }
            .car-icon {
              margin-right 15px
              width 18px
              height 18px
              backImg('~assets/images/shop-car-icon.png')
            }
            .float {
              position absolute
              wh(25px, 16px)
              border-radius 8px 8px 8px 0
              background #0f4511
              font-size 12px
              width 25px
              color #fff
              text-align center
              line-height 16px
              right 2px
              top 5px
            }
          }
        }

        .info-box {
          display: flex;
          align-items: end;
          .imgs {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 420px;
            position: relative;
            .activity-tab {
              position: absolute;
              top: 310px;
              left: 30px;
              width: 360px;
              height: 50px;
              background-image: linear-gradient(-90deg, #6D33FF, #E44FFF);
              padding: 0 20px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              color: white;
              .box1 {
                display: flex;
                flex-direction: row;
                padding-bottom: 16px;
                .box1-1 {
                  line-height: 1;
                  font-size: 14px;
                  padding-top: 20px;
                }
                .box1-2 {
                  padding-top: 16px;
                  line-height: 1;
                  font-weight: bold;
                  font-size: 18px;
                  padding-right: 10px;
                }
              }
              .box2 {
                padding: 9px 0;
                .box2-1 {
                  line-height: 1;
                  font-size: 12px;
                  padding-bottom: 6px;
                }
                .box2-2 {
                  text-align: center;
                  line-height: 1;
                  font-size: 14px;
                }
              }
            }
            .main-img {
              width: 360px;
              height: 360px;
            }
            .img-selector {
              display: flex;
              margin-top: 10px;
              align-items: center;
              .sub-img {
                width: 70px;
                height: 70px;
                cursor: pointer;
                margin: 0 6px;
              }
              .sub-selected {
                border: 1px solid #0f4511;
              }
            }
          }
          .goods {
            color: #999;
            font-size: 15px;
            margin-left: 5px;
            .goods-name {
              width: 550px;
              font-size: 20px;
              color: rgba(26, 26, 26, 1);
              margin: 6px 0 6px;
            }
            .goods-selector {
              position: relative;
              width: 550px;
              background: rgba(245, 245, 245, 1);
              padding: 14px 20px 16px 20px;
            }
            .row {
              //display: flex;
              //flex-direction: row;
              margin: 24px 0;

              &:first-child {
                margin-top: 0;
                margin-bottom: 14px
              }
              .title {
                display: inline-block;
                width: 80px;
                text-justify: inter-ideograph;
                text-align: justify;
              }
              //限时折扣
              .discount {
                text-decoration: line-through;
              }
              //定金膨胀
              .earnest {

              }
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
              .sizes,
              .colors {
                display: inline-flex;
                flex-wrap: wrap;
                width: 420px;
                .size {
                  line-height: 15px;
                  padding: 9px 10px;
                  background: rgba(255, 255, 255, 1);
                  border: 1px solid rgba(204, 204, 204, 1);
                  margin-bottom: 6px;
                  cursor: pointer;
                }
                .death {
                  color: rgba(204, 204, 204, 1);
                }
                .color-img {
                  width: 50px;
                  height: 50px;
                }
                .size-selected,
                .color-selected {
                  border: 1px solid rgba(252, 15, 61, 1);
                }
              }
            }

            .row1 {
              display: flex;
              flex-direction: row;
              margin: 20px 0;
              .deposit {
                display: flex;
                flex-direction: column;
                .deposit-tips {
                  font-size: 12px;
                  color: #999999;
                }
              }
              .active-tag {
                display: inline-block;
                color: #0f4511;
                border: #0f4511 1px solid;
                line-height: 2;
                padding: 0 10px;
                font-size: 15px;
                margin-right: 10px;
              }
              .active-text {
                line-height: 2;
                font-size: 15px;
                color: black;
              }
              &:first-child {
                margin-top: 0;
                margin-bottom: 20px
              }
              .deposit-title {
                line-height: 2.4;
                font-size: 15px;
                width: 80px;
                text-justify: inter-ideograph;
                text-align: justify;
              }
              .title {
                line-height: 2;
                font-size: 15px;
                width: 80px;
                text-justify: inter-ideograph;
                text-align: justify;
              }
              //限时折扣
              .discount {
                text-decoration: line-through;
              }
              //定金膨胀
              .earnest {

              }

            }
            .collection {
              position: absolute;
              top: 15px;
              right: 15px;
            }
            .then {
              font-size: 15px;
              color: rgba(153, 153, 153, 1);
              width: auto;
              margin-left: 10px;
            }
            .buttons {
              display: flex;
              align-items: center;
              // justify-content: center;
              margin-top: 20px;
              button {
                width: 178px;
                height: 42px;
                font-size: 18px;
                border: 1px solid #0f4511;
                margin: 0 5px;
                box-sizing: border-box;
                cursor: pointer;
                font-weight: 400;
                &.is-disabled {
                  border-color: unset;
                }
                &:active {
                  box-shadow: 0 0 2px 0 #0f4511;
                }
              }
              .buy {
                background: #0f4511;
                color: white;
              }
              .cart {
                background: white;
                color: #0f4511;
              }
            }
          }
        }
        padding-bottom: 30px;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
      }
      .comment {
        margin: 30px 0 0;
        .segments {
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          background: rgba(245, 245, 245, 1);
          border-bottom: 1px solid #0f4511;
          cursor: pointer;
          .segment {
            height: 20px;
            font-size: 15px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            padding: 0 50px;
          }
          .segment-selected {
            // @extend .segment;
            height: 20px;
            font-size: 15px;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            padding: 0 50px;

            position: relative;
            color: #0f4511
            &:after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate3d(-3px, 10px, 0);
              border-top: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-bottom: 5px solid #0f4511;
            }
          }
        }
        .cards {
          .card1 {
            display: flex;
            padding: 30px 0;
            border-bottom: 1px solid rgba(224, 224, 224, 1);
            .total-rate {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin: 0 60px;
              .count {
                font-size: 46px;
                color: #000;
              }
            }
            .star-desc {
              display: flex;
              align-items: center;
              span {
                display: inline-block;
                width: 24px;
                text-align: right;
                margin-right: 4px;
              }
              .rate-line {
                height: 2px;
                margin-left: 10px;
              }
              .line5 {
                width: 200px;
                // @extend .rate-line;
                height: 2px;
                margin-left: 10px;
                background: #0f4511;
              }
              .line4 {
                width: 60px;
                // @extend .rate-line;
                height: 2px;
                margin-left: 10px;
                background: #0f4511;
              }
              .line3 {
                width: 30px;
                // @extend .rate-line;
                height: 2px;
                margin-left: 10px;
                background: #0f4511;
              }
              .line2 {
                width: 15px;
                // @extend .rate-line;
                height: 2px;
                margin-left: 10px;
                background: rgba(204, 204, 204, 1);
              }
              .line1 {
                width: 10px;
                // @extend .rate-line;
                height: 2px;
                margin-left: 10px;
                background: rgba(204, 204, 204, 1);
              }
            }
          }
          .card {
            display: flex;
            align-items: center;
            flex-direction: row;
            border-bottom: 1px solid rgba(224, 224, 224, 1);
            .user {
              display: flex;
              justify-content: left;
              align-items: center;
              padding-left: 10px;
              width: 160px;
              img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
              }
            }
            .comment-content {
              display: flex;
              flex-direction: column;
              margin: 30px 0 20px 0;
              .content-desc {
                margin: 15px 0;
              }
              .content-imgs {
                display: flex;
                .view {
                  margin-right 10px;
                }
              }
            }
          }
          .introimg {
            width: 100%;
          }
        }
        .pagination {
          text-align: right;
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          margin-top: 30px;
          button {
            display: inline-block;
            width: 38px;
            line-height: 38px;
            text-align: center;
            border: 1px solid rgba(204, 204, 204, 1);
            margin: 0 3px;
          }
          .current {
            cursor: pointer;
            border: 0;
            color: #0f4511;
          }
          .pre {
            width: 98px;
            cursor: pointer;
          }
          .next {
            width: 98px;
            cursor: pointer;
          }
          .death {
            color: rgba(179, 179, 179, 1);
            background: rgba(247, 247, 247, 1);
          }
        }
      }
    }
    .count {
      color: #000;
      font-weight: 700;
      font-size: 24px;
      padding-right 10px
      .rmb {
        font-size: 12px;
      }
    }
    .history {
      margin: 20px 0 0 30px;
      h6 {
        margin: 0;
        padding: 0;
        font-size: 15px;
        font-weight: 500;
        color: rgba(179, 179, 179, 1);
      }
      .card0 {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid rgba(230, 230, 230, 1);
        margin-top: 24px;
        cursor: pointer;
        img {
          width: 148px;
          height: 148px;
          margin-bottom: 10px;
        }
        span:last-child {
          margin-bottom: 10px;
        }
        .count {
          font-size: 15px;
        }
      }
    }
    .el-icon-arrow-right,
    .el-icon-arrow-left {
      cursor: pointer;
    }
  }
  .empty-box {
    width 960px
    height 150px
    text-align center
    vertical-align middle
    line-height 150px
    font-size 16px
  }
  .el-table .success-row {
    background: #0f4511;
    color: #000;
  }
  .blod-font {
    font-size: 30px;
    color: #0f4511;
    font-weight: 700;
  }
  .goods-content{
    width: 550px;
    font-size: 12px;
    margin: 5px 0;
  }
</style>
