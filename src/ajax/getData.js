import fetch from "@/config/async/fetch";

export const userLongin = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/memberLogin",
    data,
    "POST"
  );
};

export const sendCode = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/sendSms",
    data,
    "POST"
  );
};

export const getOrderList = data => {
  return fetch(
    "/mall-deepexi-trade-center/api/v1/order/orderList",
    data,
    "GET"
  );
};

export const getOrderDetail = data => {
  return fetch(
    "/mall-deepexi-trade-center/api/v1/order/orderDetail",
    data,
    "GET"
  );
};

export const register = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/register",
    data,
    "POST"
  );
};

// 渠道商-申请退款
export const refundApply = (data, query) => {
  let querys = [];
  for (let key in query) {
    querys.push(key + "=" + query[key]);
  }
  let url =
    "/mall-deepexi-trade-center/api/v1/refund/channel/apply?" +
    querys.join("&");
  return fetch(url, data, "POST");
};

// 渠道商-申请退款
export const getRefundList = data => {
  return fetch(
    "/mall-deepexi-trade-center/api/v1/refund/channel/list",
    data,
    "GET"
  );
};

// 新增评价
export const ecEvaluations = (data, query) => {
  let querys = [];
  for (let key in query) {
    querys.push(key + "=" + query[key]);
  }
  let url =
    "/mall-deepexi-evaluate-center/api/v1/ecEvaluations?" + querys.join("&");
  return fetch(url, data, "GET");
};

// 查看评价
export const getEcEvaluations = (data, id) => {
  return fetch(
    "/mall-deepexi-evaluate-center/api/v1/ecEvaluations/" + id,
    data,
    "GET"
  );
};

//
export const getUserBrowseInfo = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/getUserBrowseInfo",
    data,
    "GET"
  );
};
export const updateSafety = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/updateAccountSecurity",
    data,
    "PUT"
  );
};

export const sendEmail = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcMemberAccounts/sendSms",
    data,
    "POST"
  );
};

//查询商品详情
export const getGoodsDetail = data => {
  return fetch(
    "/mall-deepexi-product-center/api/v1/buyer/pcItems/item",
    data,
    "GET"
  );
};
//购物车
export const getCart = data => {
  return fetch("/mall-deepexi-trade-center/api/v1/cart", data, "GET");
};

//添加到购物车
export const addtoCart = data => {
  return fetch("/mall-deepexi-trade-center/api/v1/cart", data, "POST");
};

//添加到购物车
export const deleteGoods = data => {
  return fetch("/mall-deepexi-trade-center/api/v1/cart", data, "POST");
};

//订单下单
export const addOrder = data => {
  return fetch("/mall-deepexi-trade-center/api/v1/order/add", data, "POST");
};

//搜索
export const search = data => {
  return fetch(
    "/mall-deepexi-product-center/api/v1/buyer/pcItems/query",
    data,
    "GET"
  );
};
//首页推荐
export const getRecommendList = data => {
  //return fetch("/mall-deepexi-mall-config-api/api/v1/featuredFirsts", data, "GET");
  return fetch(
    "/mall-deepexi-mall-config-api/api/v1/featuredFirsts/buyer",
    data,
    "GET"
  );
};
//获取收件人地址
export const getAddress = data => {
  return fetch(
    "/mall-deepexi-member-center/api/v1/mcDeliveryAddress",
    data,
    "GET"
  );
};
// 新增收件人地址
export const createAddress = data => {
  return fetch(
    `/mall-deepexi-member-center/api/v1/mcDeliveryAddress`,
    data,
    "POST"
  );
};
// 编辑收件人地址
export const editAddress = (id, data) => {
  return fetch(
    `/mall-deepexi-member-center/api/v1/mcDeliveryAddress/${id}`,
    data,
    "PUT"
  );
};
//设置默认地址
export const setDefaultAddress = (id, data) => {
  return fetch(
    `/mall-deepexi-member-center/api/v1/mcDeliveryAddress/${id}/default`,
    data,
    "PUT"
  );
};
//获取类目
export const getPrecategorys = data => {
  return fetch(
    "/mall-deepexi-product-center/api/v1/pcPrecategorys/tree",
    data,
    "GET"
  );
};

//获取定位
export const getCity = data => {
  let url =
    "//sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=ip地址&co=&resource_id=6006&t=1512612231044&ie=utf8&oe=gbk&format=json&tn=baidu";
  return fetch(url, data, "GET");
};
