import { code2ShortName } from "./province";
import dayjs from "dayjs";

export function formatDate(time, format = "YYYY-MM-DD HH:mm") {
  if (!time) {
    return "";
  }
  return dayjs(time).format(format);
}

//通过code值获取省份名称
export const toProvinceName = code => code2Name[code];
//通过code值获取省份简称
export const toProvinceShortName = code => code2ShortName[code];

// good-detail更改数据格式
export function changeData(list, type) {
  let proData = [],
    proObj = {};

  list.forEach(i => {
    let listType;
    listType = type ? i.name : i.type;
    if (!proObj[listType]) {
      proData.push({
        type: listType,
        data: [i]
      });
      proObj[listType] = i;
    } else {
      proData.forEach(d => {
        if (d.type === listType) {
          d.data.push(i);
        }
      });
    }
  });

  return proData;
}
