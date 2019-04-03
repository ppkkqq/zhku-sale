import { getCurrentCity } from "@/utils";

export default function(context) {
  const { store } = context;
  // 在未定位或者选择城市的情况下，定位城市
  // if (store.state.locationCity.cityCode) {
  //   return
  // }
  // 统一了属性名 ${region} -> ${region}+Name
  if (localStorage.getItem("currentCity")) {
    const currentCity1 = JSON.parse(localStorage.getItem("currentCity"));
    store.commit("update", { locationCity: currentCity1 });
    getAddress(store, currentCity1);
    return;
  }
  getCurrentCity(
    result => {
      const { addressComponent } = result;
      const city = {
        provinceName: addressComponent.province,
        cityName: addressComponent.city,
        areaName: addressComponent.district,
        cityCode: addressComponent.adcode.substr(0, 4) + "00",
        provinceCode: addressComponent.adcode.substr(0, 2) + "0000",
        areaCode: addressComponent.adcode
      };
      store.commit("update", { locationCity: city });
      getAddress(store, city);
    },
    error => {
      // console.log(error)
      // 定位失败，默认显示南京市
      // console.log('定位失败！！！！！！！！！！！！')
      const city = {
        cityName: "南京",
        cityCode: "320100",
        provinceName: "江苏省",
        provinceCode: "320000",
        areaName: "栖霞区",
        areaCode: "320113" //栖霞区
      };
      store.commit("update", { locationCity: city });
      getAddress(store, city);
    }
  );
}

async function getAddress(store, data) {
  let body = {
    provinceName: data.provinceName,
    cityName: data.cityName,
    areaName: data.areaName,
    provinceId: data.provinceCode,
    cityId: data.cityCode,
    areaId: data.areaCode
  };
  let JDAddress = await store.dispatch("getJDAddress", body);

  let locationCityforJD = {
    provinceName: JDAddress.provinceName,
    cityName: JDAddress.cityName,
    areaName: JDAddress.areaName,
    provinceCode: JDAddress.provinceId,
    cityCode: JDAddress.cityId,
    areaCode: JDAddress.areaId
  };
  store.commit("update", { locationCityforJD: locationCityforJD });
}
