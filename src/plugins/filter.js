/**
 * Created by levy on 2018/8/15.
 */
// 这里编写全局注册的filter
import Vue from "vue";
import { isNull, resolveImg } from "@/utils";
import { formatDate } from "@/const/filter";

// 千分位分隔符表示价格
// 123456 => 123,456
function price(val) {
  if (isNull(val) || isNaN(val)) return;
  let USPrice = Number.parseFloat(val).toLocaleString("en-US");

  // 完全是整数, 需要添加小数点
  if (USPrice.toString().indexOf(".") === -1) USPrice += ".00";

  return "¥" + USPrice;
}

// 价格范围后半段没有人民币符号.所以截掉了
function priceWithoutTag(val) {
  const p = price(val);
  return p ? p.slice(1) : val;
}

export function ossPath(url = "") {
  if (url.startsWith("http")) return url;
  let svgPath = "https://osscdn.gtytong.com/assets/svg";
  let imgPath = "https://osscdn.gtytong.com/assets/images";
  let index = url.lastIndexOf(".");
  //后缀
  let ext = url.substr(index + 1);

  switch (ext.toLocaleLowerCase()) {
    case "svg":
      return `${svgPath}/${url}`;
      break;
    default:
      return `${imgPath}/${url}`;
      break;
  }
}

//商品规格
function goodStandard(propList = []) {
  return propList
    .map(item => {
      return `${item.name}：${item.value}`;
    })
    .join(" | ");
}

function phone(mobile = "") {
  return (
    mobile.toString().substring(0, 3) + "****" + mobile.toString().substring(7)
  );
}

const filters = {
  price,
  priceWithoutTag,
  goodStandard,
  phone,
  resolveImg,
  formatDate,
  ossPath
};

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
export default filters;
