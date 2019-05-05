export const tenantCode = "90f53cb2a61043858819c9a07e7cf863";

// 调用security接口要用到
export const projectNo = "2062ee3d4eeb40598ef6fba99d143415";
// 店铺中心
export const SHOP_CENTER = "/mall-deepexi-shop-center/api/v1";
// 商品中心
export const PRODUCT_CENTER = "/mall-deepexi-product-center/api/v1";
export const MEMBER_CENTER = "/mall-deepexi-member-center/api/v1";
export const TRADE_CENTER = "/mall-deepexi-trade-center/api/v1";
export const MALL_CONFIG = "/mall-deepexi-mall-config-api/api/v1";
export const APPLICATION = "/mall-application-api/api/v1";
export const EVALUATE_CENTER = "/mall-deepexi-evaluate-center/api/v1";
export const ACCOUNT_CENTER = "/mall-deepexi-account-center/api/v1";
export const SEARCH_CENTER = "/mall-deepexi-search-center/api/v1";
export const MARKING_CENTER = "/mall-deepexi-marking-center/api/v1";
export const STOCK_CENTER = "/mall-deepexi-stock-center/api/v1";

//-----------------------待清理api----------------------------s
// 接口变量名一般驼峰命名, 上面的大写的就不管了

//意见反馈
export const feedback = MALL_CONFIG + "/feedbacks";

// 登录注册
export const sendCode = MEMBER_CENTER + "/mcMemberAccounts/sendSms";
//export const registerUrl = MEMBER_CENTER + '/mcMemberAccounts/register'
export const wxlogin = MEMBER_CENTER + "/mcMemberAccounts/wxlogin";

// 商品关注
export const isCollect = id => `${MEMBER_CENTER}/wxMember/pcItems/${id}/check`;
export const cancelCollect = MEMBER_CENTER + "/mcItemCollects/cancel";

// 首页广告位
export const adverisements = MALL_CONFIG + "/advertisements";

// 支付
export const payOrder = TRADE_CENTER + "/carOrder/trade-order/pay";
// 获取会员关注商品
export const memberCollections = id =>
  APPLICATION + `/goodsAttentions/buyers/personalCollectsDetails/${id}`;
// 申请订金退款
export const applyRefund = TRADE_CENTER + "/refund/channel/apply";
//会员登出
export const accountLogout = MEMBER_CENTER + "/mcMemberAccounts/logout";

//------------国投的api全部记录到这个注释下面，后续会清理上面的api-----------
// 首页推荐位
export const featuredFirsts = MALL_CONFIG + "/featuredFirsts";
// 楼层
export const floorAllFloor = MALL_CONFIG + "/floor/allFloor";

//购物车
// 获取购物车列表
// export const cartList = TRADE_CENTER + "/cart";
// 添加购物车
export const addCart = cartList;
// 从购物车删除
export const deleteCart = cartList;
// 修改购物车数量
export const updateQty = cartList + "/updateQty";

//用户
// export const loginUrl = MEMBER_CENTER + "/mcMemberAccounts/memberLogin";

export const registerUrl = MEMBER_CENTER + "/mcMemberAccounts/register";

export const sendSms = MEMBER_CENTER + "/mcMemberAccounts/sendSms";
// 用户个人信息
export const userInfo = MEMBER_CENTER + "/mcMemberAccounts/info";
// 修改个人信息
export const userInfoEdit = id => MEMBER_CENTER + `/mcMemberAccounts/${id}`;

// 发送验证码，同时返回手机号码已经注册
export const checkLoginMobile =
  MEMBER_CENTER + "/mcMemberAccounts/checkLoginMobile";
// 检查手机是否已经注册，未注册，发送验证码，已注册返回已注册
export const checkMobile = MEMBER_CENTER + "/mcMemberAccounts/checkMobile";
//校验短信验证码
export const verifySmsCode = MEMBER_CENTER + "/mcMemberAccounts/verifySmsCode";

//账户安全中心
// 更新账户安全信息
export const updateAccountSecurity =
  MEMBER_CENTER + "/mcMemberAccounts/updateAccountSecurity";
export const checkLoginOldPassword =
  MEMBER_CENTER + "/mcMemberAccounts/checkLoginOldPassword";
export const checkOldTransactionPassword =
  MEMBER_CENTER + "/mcMemberAccounts/checkOldTransactionPassword";
// 基础商品详情
export const goodsDetail = PRODUCT_CENTER + "/buyer/pcItems/item/detail";
//商品活动详情
export const goodsMarkingDetail =
  PRODUCT_CENTER + "/buyer/pcItems/marking/detail";
//sku详情
export const skuDetail = PRODUCT_CENTER + "/buyer/pcItems/sku";
// 商品列表
export const goodsList = PRODUCT_CENTER + "/buyer/pcItems/query";
// 地址列表
export const deliveryAddress = MEMBER_CENTER + "/mcDeliveryAddress";
// 商品收藏
export const collect = MEMBER_CENTER + "/mcItemCollects";
//全部商品分类
export const categoryTree = PRODUCT_CENTER + "/pcPrecategorys/tree";

//订单
export const orderList = TRADE_CENTER + "/order/orderList";
//下单
export const addOrder = TRADE_CENTER + "/order/add";
// 取消订单
export const cancelOrder = TRADE_CENTER + "/order/orderCancel";
export const orderDetail = TRADE_CENTER + "/order/orderDetail";
//支付状态详情
export const orderPaidStatus = TRADE_CENTER + "/order/queryPayment";
export const prePay = TRADE_CENTER + "/order/prePay";
//支付前校验
export const checkPay = TRADE_CENTER + "/order/preWxPrePayId";
//微信支付
export const wechatPay = TRADE_CENTER + "/order/wxPrePayId";
// 定金支付
export const earnestPay = TRADE_CENTER + "/order/earnestPay";

//-------------------账号中心------------------------
//国源通币
export const ytCoin = ACCOUNT_CENTER + "/shoppingcard/count";
export const queryYtCoin = ACCOUNT_CENTER + "/shoppingcard/query";
export const useRecords = ACCOUNT_CENTER + "/shoppingcard/useRecords";
//国源通币统计查询
export const statisticalQuery = ACCOUNT_CENTER + "/shoppingcard/count";
//订单结算页国源通币
export const orderYtCoin = ACCOUNT_CENTER + "/shoppingcard/orderUsed";

//-------------------评价中心------------------------
//新增评价
export const addComments = EVALUATE_CENTER + "/ecEvaluations";

export const updateOrderStatusCommented =
  TRADE_CENTER + "/order/updateOrderStatusCommented";

//-------------------售后退货------------------------
//渠道商-退款管理列表
export const applyList = TRADE_CENTER + "/refund/channel/list";
//渠道商-申请退款
export const apply = TRADE_CENTER + "/refund/channel/apply";
export const applyDetail = TRADE_CENTER + "/refund/channel/detail";
//取消售后
export const cancelRefund = TRADE_CENTER + "/refund/channel/cancel";
//填入快递单号
export const inputLogisticsOrder =
  TRADE_CENTER + "/refund/channel/inputLogisticsOrder";
//---------------浏览记录
export const getUserBrowseInfo =
  MEMBER_CENTER + "/mcMemberBrowse/getUserBrowseInfo";

export const queryIntegral = ACCOUNT_CENTER + "/point/query";

// 查询运费
export const orderFreight = TRADE_CENTER + "/order/freight";

//查询商品评价
export const getComments = id =>
  EVALUATE_CENTER + `/ecEvaluations/detail?itemId=${id}`;

// 查看物流
export const logisticsList = TRADE_CENTER + "/logistics";

//获取旅游订单信息
export const getTourismOrderList = TRADE_CENTER + "/order/tourismOrderList";
export const queryIntegralList = id => ACCOUNT_CENTER + `/point/${id}/list`;

//商品搜索
export const products = SEARCH_CENTER + "/products";
//售后详情
export const aftermarketDetail = TRADE_CENTER + "/refund/channel/malldetail";

// 添加预订单，获取拆单后数据
export const orderSettle = TRADE_CENTER + "/order/orderSettle";

//最近三个月积分统计查询
export const queryIntegralCount = id => ACCOUNT_CENTER + `/point/${id}/count`;

//会员等级
export const memberLevelName =
  MEMBER_CENTER + "/mcMemberAccounts/getMemberLevelName";

//-------------------营销中心------------------------
export const couponData = MARKING_CENTER + "/coupon/findMyCoupon";
//京东地址编码
// export const getJdAddress = STOCK_CENTER + "/stocStocks/getJdAddress";
// 根据京东父地址ID 查询子地址
export const findChildAddressByParentAreaId =
  STOCK_CENTER + "/address/findChildAddressByParentAreaId";
// 根据定位的地址（高德） 查询京东地址
export const findAddress = STOCK_CENTER + "/address/findAddress";
// 根据type 查询京东地址
export const findChildAddressByType =
  STOCK_CENTER + "/address/findChildAddressByType";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1my
export const localhost = "http://localhost/web_ks";

export const getRecommendList = localhost + "/getbaby.php";
export const getDetailById = localhost + "/getproduct.php";
//图片链接加载
export const getPicture = localhost + "/picture/";
export const getBabyRecord = localhost + "/record.php";
export const commitNewPrice = localhost + "/baozhengjin.php";
export const searchGoodsList = localhost + "/getbaby_all.php";
export const loginUrl = localhost + "/login.php";
export const cartList = localhost + "/getCartList.php";
export const add2cart = localhost + "/add2cart.php";
export const getHistory = localhost + "/getHistory.php";
export const addHistory = localhost + "/addHistory.php";
export const getOrderList = localhost + "/orderList.php";
export const getOrderDetail = localhost + "/orderDetail.php";
export const commentList = localhost + "/commentList.php"; //卖家
export const getCommentList = localhost + "/myCommentList.php"; //买家
export const getPriceList = localhost + "/getPriceList.php";
//卖家拍卖中的商品列表
export const getProductList = localhost + "/getProductList.php";
export const getAddressList = localhost + "/getAddressList.php";
export const deleteAddress = localhost + "/deleteAddress.php";
export const newAddress = localhost + "/newAddress.php";
export const newComment = localhost + "/newComment.php";
export const addCommentPic = localhost + "/addCommentPic.php";
export const newOrder = localhost + "/newOrder.php";
export const addProductPic = localhost + "/addProductPic.php";
export const newProduct = localhost + "/newProduct.php";
export const deleteCartGood = localhost + "/deleteCartGood.php";
export const addRegister = localhost + "/addRegister.php";
export const isSeller = localhost + "/isSeller.php";
export const addSellerPic = localhost + "/addSellerPic.php";
export const commitSeller = localhost + "/commitSeller.php";
