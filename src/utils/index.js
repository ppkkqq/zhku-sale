export function isNull(o) {
  return o === null || o === void 0;
}

// 一键拨号
export function dialPhone(phone) {
  window.location.href = `tel:${phone}`;
}

export function isWeiXin() {
  let ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
}

// 传phoneUrl，没有时返回默认图片
export function resolveImg(productPhoto) {
  return (
    (productPhoto && productPhoto.split(",")[0]) ||
    "https://osscdn.gtytong.com/assets/images/default-img-normal.png"
  );
}

export function getCurrentCity(success, error) {
  // 先引入'https://webapi.amap.com/maps?v=1.4.10&key=2951b80b69c1c4bbca360ba0dc675540'
  if (typeof AMap === "undefined") {
    return false;
  }

  var mapObj = new AMap.Map("iCenter");
  mapObj.plugin("AMap.Geolocation", function() {
    var geolocation = new AMap.Geolocation({
      enableHighAccuracy: false, //是否使用高精度定位，默认:true
      timeout: 10000, //超过10秒后停止定位，默认：无穷大
      maximumAge: 0, //定位结果缓存0毫秒，默认：0
      convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true, //显示定位按钮，默认：true
      buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
      showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);
    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, "complete", success); //返回定位信息
    AMap.event.addListener(geolocation, "error", error); //返回定位出错信息
  });

  // typeof AMap !== 'undefined' &&
  //   AMap.plugin('AMap.CitySearch', function() {
  //     var citySearch = new AMap.CitySearch()
  //     citySearch.getLocalCity(function(status, result) {
  //       if (status === 'complete' && result.info === 'OK') {
  //         debugger
  //         return success && success(result)
  //       }
  //       error && error(result)
  //     })
  //   })
}
