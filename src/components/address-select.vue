<template>
  <div class="address_warp">
    <div class="address_dialog" :class="{'show_address': !isLogin}">
      <i class="el-icon-close address_close" @click="closeAddressTab"></i>
      <!-- 供城市选择 -->
      <div class="address_diy_part" v-if="level == 2">
        <div class="address_part_title">
          <i class="el-icon-location-outline"></i>
          选择当前定位城市
        </div>
        <span class="address_diy_name" :class="{'active': localActive}" @click="selectLocal">
          <span>{{locationCityName}}</span>
          <i class="selected"></i>
        </span>
      </div>
      <!-- 供地区选择 -->
      <div class="address_type_user" v-if="addressList.length && level == 3">
        <div class="address_part_title">从我的收货地中选择</div>
        <ul class="address_lists clearfix">
          <li
            class="address_item"
            @click="selecteAddress(index)"
            v-for="(item,index) in addressList"
            v-if="index<2"
            :key="index"
            :class="{active: activeAddr==index || item.id == selectedAddress.id}"
          >
            <div class="address_default" v-show="item.defaultStatus>0">默认地址</div>
            <div class="address_sub clearfix">
              <div
                class="address_brief"
              >{{item.deliveryName}}{{item.deliveryPhone||item.deliveryMobile}}</div>
            </div>
            <div class="address_detail">{{resolveAddress(item)}}</div>
            <i>已选中</i>
          </li>
        </ul>
        <!-- 地址选择框 -->
        <div
          v-show="addressList.length>2 && !isShowMore"
          @click="isShowMore = true"
          style="color: #307DDF;font-size: 12px;cursor: pointer;"
        >
          更多地址选择
          <i class="el-icon-d-arrow-right"></i>
        </div>
        <ul class="address_lists clearfix" v-show="isShowMore">
          <li
            class="address_item"
            @click="selecteAddress(index)"
            v-for="(item,index) in addressList"
            v-if="index>=2"
            :key="index"
            :class="{active: activeAddr==index}"
          >
            <div class="address_default" v-show="item.defaultStatus>0">默认地址</div>
            <div class="address_sub clearfix">
              <div class="address_brief">{{item.deliveryName}}</div>
            </div>
            <div
              class="address_detail"
            >{{resolveAddress(item)}} {{item.deliveryPhone||item.deliveryMobile}}</div>
            <i>已选中</i>
          </li>
        </ul>
        <div
          v-show="isShowMore"
          @click="isShowMore = false"
          style="color: #307DDF;font-size: 12px;cursor: pointer;"
        >
          收起地址
          <i class="el-icon-d-arrow-left"></i>
        </div>
      </div>

      <div class="address_type_diy" style="font-size: 12px;">
        <div class="address_part_title">{{ level == 2 ? '选择其他城市' : '选择其他地址'}}</div>
        <ul class="address_title">
          <!-- Tag: 省市区 -->
          <template v-for="(item, index) in addressSelected">
            <li
              v-if="index <= level && item.name"
              :key="index"
              :class="{'selected-active': index == addressSelected.length-1 }"
              @click="switchDistrict(index)"
            >
              {{item.name}}&nbsp
              <i class="el-icon-arrow-down"></i>
            </li>
          </template>
        </ul>
        <!-- 选择栏 -->
        <div>
          <ul class="address_content">
            <li
              class="address_name"
              :class="{'active': typeShowIndex === key}"
              v-for="(value, key) in district"
              :key="key"
              @click="selectDistrict(value, key)"
            >{{value}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arealist from "@/const/arealist";
import isEqual from "lodash/isEqual";

export default {
  name: "address-select",
  props: {
    /**
     * 切换层级
     * 2 市
     * 3 区/县
     */
    level: {
      type: Number,
      default: 3
    },
    location: {
      type: Object,
      required: true
    },
    selectedCity: {
      type: Object
    },
    selectedAddress: {
      type: Object
    },
    addressList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      district: [],
      typeShowIndex: 0,
      localActive: true, // 是否选择当地城市
      tagClick: 0, // 0 未点击标签 | 1 省 | 2 市 | 3 区/县
      isMounted: false,
      down: true,
      isLogin: false,
      activeAddr: null,
      region: [],
      isShowMore: false
    };
  },
  watch: {
    selectedAddress: {
      handler(newAddress, oldAddress) {
        if (!isEqual(newAddress, oldAddress) && this.level == 3)
          this.$emit("selected", { level: this.level, selected: newAddress });
      },
      deep: true
    }
  },
  computed: {
    locationCityName() {
      return this.location.cityName;
    },
    selectedCityName() {
      return this.selectedCity.cityName;
    },
    addressSelected() {
      if (!this.isMounted) {
        // 页面初始化
        let address;
        const props = ["provinceCode", "cityCode", "areaCode"];
        if (this.level == 3) {
          // 地址选择
          // 如果已经有选择过地址（或者默认地址），显示该地址
          if (this.selectedAddress && this.selectedAddress.provinceCode) {
            address = this.selectedAddress;
          } else if (this.location && this.location.provinceCode) {
            address = this.location;
          } else {
            return;
          }
        } else {
          // 城市选择
          if (this.selectedCity && this.selectedCity.provinceCode) {
            address = this.selectedCity;
          } else if (this.location && this.location.provinceCode) {
            address = this.location;
          } else {
            return;
          }
        }
        this.$emit("selected", { level: this.level, selected: address });
        this.setAddressSelected(address);
        this.getDistrict(address[props[this.level - 1]], this.level - 1);
        this.isMounted = true;
        return this.region;
      }
      // 其他数据流向
      return this.region;
    }
  },
  methods: {
    closeAddressTab() {
      this.$emit("closeTab");
    },
    /**
     * 切换地区
     * 0 省
     * 1 市
     * 2 县
     * @param index
     */
    switchDistrict(index) {
      // 获取本级行政区列表
      this.tagClick = index + 1;
      let code = this.addressSelected[index].code;
      this.region.splice(index + 1); // 保留tag
      this.getDistrict(code, index);
    },
    resolveAddress(item) {
      return `${item.provinceName} ${item.cityName} ${item.address}`;
    },
    selecteAddress(index) {
      this.activeAddr = index;
      this.$emit("selected", {
        level: this.level,
        selected: this.addressList[index]
      });
      this.closeAddressTab();
    },
    selectLocal() {
      this.localActive = true;
      this.$emit("selected", { level: this.level, selected: this.location });
      this.closeAddressTab();
    },
    /**
     * 从areaList中获取对应的地址
     * 匹配规则code值
     * 省：前2位匹配
     * 市/区：前4位匹配
     * @param {String} code 行政区编号
     * @param {Number} level 行政区等级 0 省 | 1 市 | 2 区/县
     */
    getDistrict(code, level) {
      let area = ["province_list", "city_list", "county_list"];
      let match = [0, 2, 4]; // 匹配位数
      let type = area[level];
      let district = arealist[type];

      if (district && code) {
        district = Object.keys(district).reduce((result, key, index) => {
          if (
            key.substring(0, match[level]) === code.substring(0, match[level])
          ) {
            result = { ...result, [key]: district[key] };
          }

          return result;
        }, {});
      }

      this.district = district;
    },
    /**
     * @param {String} value 行政区名称
     * @param {String} key 行政区编号
     */
    selectDistrict(value, key) {
      if (this.level == 3) this.activeAddr = null;
      this.localActive = false;
      const address = this.addressSelected;
      const addressSelectedLen = address.length;

      // 初始化后，编辑最后一个tag
      if (addressSelectedLen > this.level - 1) {
        this.region.splice(addressSelectedLen - 1);
      }
      // 点击标签重选本级行政区
      if (!!this.tagClick) {
        this.region.splice(this.tagClick - 1);
        this.tagClick = 0;
      }

      this.region.push({
        name: value,
        code: key
      });
      const addressLen = address.length;
      if (addressLen != this.level) {
        this.getDistrict(key, addressLen);
        return;
      }

      // 选择完毕，触发事件
      let selectedAddress = {
        provinceName: address[0].name,
        provinceCode: address[0].code,
        cityName: address[1].name,
        cityCode: address[1].code,
        areaName: address[1].name, // 占位
        areaCode: address[1].code // 占位
      };

      if (addressLen === 3) {
        // 选择到区/县
        selectedAddress.areaCode = address[2].code;
        selectedAddress.areaName = address[2].name;
      }
      this.$emit("selected", { level: this.level, selected: selectedAddress });
      this.closeAddressTab();
      return;
    },
    setAddressSelected(address) {
      this.region.push(
        {
          name: address.provinceName,
          code: address.provinceCode
        },
        {
          name: address.cityName,
          code: address.cityCode
        }
      );
      if (this.level == 3)
        this.region.push({
          name: address.areaName,
          code: address.areaCode
        });
    }
  },
  mounted() {
    /*  TODO:
    初始化列表
    level 2 获取城市定位，
    level 3 获取地区定位，有默认地址则取默认地址
    勾选选项
    最后一个标签激活
     */
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/mixin.styl'

.address_warp {
  position: absolute
  z-index: 1000
  display: block
  color: #333
}

.address_dialog {
  width: 450px
  position: relative
  background-color: #fff
  border: 1px solid #aaa
  height: 300px
  padding: 10px
  padding-top: 4px
  overflow: auto
}

.address_dialog .address_close {
  width: 14px
  height: 14px
  position: absolute
  right: 5px
  cursor: pointer
  overflow: hidden
  font-size: 14px
  top: 5px
  color: #333
}

.address_dialog .address_diy_part {
  margin-bottom: 10px
}

.address_dialog .address_part_title {
  margin-bottom: 5px
  font-size: 12px
  color: #999
}

.address_dialog .address_part_title .address_icon {
  font-size: 14px
  margin-right: 2px
}

.address_dialog .address_diy_part .address_diy_name {
  position: relative
  border: 2px solid #ddd
  padding: 2px 6px
  border-radius: 2px
  cursor: pointer
}

.address_dialog .address_diy_part .address_diy_name.active, .address_dialog .address_diy_part .address_diy_name:hover {
  border: 2px solid #FF0036
}

.address_dialog .address_diy_part .address_diy_name {
  position: relative
  border: 2px solid #ddd
  padding: 2px 6px
  border-radius: 2px
  cursor: pointer
  font-size: 12px
}

.address_dialog .address_diy_part .address_diy_btn {
  color: #FF0036
  cursor: pointer
  margin-left: 10px
  position: relative
  display: none
  font-size: 12px
}

.address_dialog.show_address .address_type_diy {
  display: block
  font-size: 12px
  position: relative
  background-color: #FFF
  z-index: 1
  margin-right: 8px
}

.address_dialog .address_type_diy {
  display: none
  position: relative
  background-color: #FFF
  z-index: 1
}

.clearfix, .headerCon {
  zoom: 1
}

.address_dialog .address_type_diy .address_selected .address_title {
  display: block
  color: #333
  cursor: pointer
  padding: 3px 8px
  border: 1px solid #d4d4d4
  margin: 0 0 -1px -1px
  float: left
  background-color: #F2F2F2
}

.address_dialog .address_type_diy .address_selected .address_title.active {
  background-color: #FFF
  border-bottom: 1px solid #FFF
  cursor: default
}

.address_dialog .address_type_diy .address_selected .address_icon_bg {
  position: relative
  margin-left: -1px
  margin-bottom: -1px
  height: 1px
  width: 1px
  background-color: #d4d4d4
}

.clearfix:after {
  content: '\20'
  display: block
  height: 0
  clear: both
}

.address_dialog .address_type_diy .address_content {
  width: 390px
}

.address_dialog .address_type_diy .address_content .address_name {
  color: #333
  border-radius: 3px
  margin: 4px 9px
  padding: 2px 6px
  line-height: 19px
  display: inline-block
  cursor: pointer
  border: 1px solid transparent
}

.address_dialog .address_type_diy .address_content .address_name.active {
  background-color: #FF0036
  color: #FFF
}

.address_dialog .address_part_title {
  margin-bottom: 5px
  font-size: 13px
}

.address_dialog .address_type_user .address_lists {
  max-height: 215px
  overflow: auto
  margin-right: -10px
}

.clearfix:after, .clearfix:before, .headerCon:after, .headerCon:before {
  display: table
  content: ''
  overflow: hidden
}

.address_dialog .address_type_user .address_lists .address_item {
  width: 190px
  height: 86px
  margin: 0 10px 10px 0
  display: block
  float: left
  cursor: pointer
  position: relative
  overflow: hidden
  padding: 5px 8px
  background-repeat: no-repeat
  background-position: 0 0
  font-size: 12px
}

.address_dialog .address_type_user .address_lists .address_item .address_sub {
  font-weight: bolder
  border-bottom: 1px solid #E5E5E5
  line-height: 24px
  height: 24px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
}

.address_dialog .address_type_user .address_lists .address_item .address_detail {
  line-height: 19px
  height: 57px
  color: #333
  display: -webkit-box
  -webkit-line-clamp: 3
  -webkit-box-orient: vertical
  overflow: hidden
  text-overflow: ellipsis
}

.address_dialog .address_type_user .address_lists .address_item {
  border: 1px solid #ccc
}

.address_dialog .address_type_user .address_lists .address_item.active, .address_dialog .address_type_user .address_lists .address_item:hover {
  border: 1px solid #0f4511
}

.address_dialog .address_type_user .address_lists .address_item .address_default {
  position: absolute
  right: 0
  top: 0
  background-color: #bbb
  color: #FFF
  padding: 0 2px
  opacity: 0.7
  font-size: 12px
  line-height: 1.5
}

.selected {
  background-image: url('~assets/images/san.png')
  position: absolute
  bottom: 0
  right: 0
  width: 12px
  height: 12px
  overflow: hidden
  text-indent: -99em
  display: none
  background-repeat: no-repeat
  background-position: 0 0
}

.active .selected {
  display: block
}

.address_name:hover {
  background-color: #ff0036
  color: #fff !important
}

.address_dialog .address_type_user .address_lists .address_item .address_brief {
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
}

.address_dialog .address_item i {
  background-image: url('~assets/images/san1.png')
  position: absolute
  bottom: 0
  right: 0
  width: 12px
  height: 12px
  overflow: hidden
  text-indent: -99em
  display: none
  background-repeat: no-repeat
  background-position: 0 0
}

.address_dialog .address_type_user .address_lists .address_item.active i {
  display: block
}

.address_title {
  border-bottom: 1px solid #0f4511
  width: 390px
}

.address_title li {
  display: inline-block
  height: 26px
  border-top: 1px solid #E6E6E6
  border-left: 1px solid #E6E6E6
  border-right: 1px solid #E6E6E6
  margin-right: 2px
  text-align: center
  line-height: 26px
  cursor: pointer
  padding: 0 4px 0 10px
}

.address_title .selected-active {
  border-top: 1px solid #0f4511
  border-left: 1px solid #0f4511
  border-right: 1px solid #0f4511
  position: relative
  z-index: 1000
  border-bottom: 2px solid #fff

  &:after {
    content: ''
    position: absolute
    height: 1px
    width: 100%
    bottom: -1px
    left: 0
    background: #fff
  }
}
</style>
