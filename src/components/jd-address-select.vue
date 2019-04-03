<template>
  <div class="address_warp">
    <div class="address_dialog show_address">
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
      <div class="address_type_user" v-if="addressList.length && level > 2">
        <div class="address_part_title">从我的收货地中选择</div>
        <ul class="address_lists clearfix">
          <li
            class="address_item"
            @click="selecteAddress(index)"
            v-for="(item,index) in addressList"
            v-if="index<2"
            :key="index"
            :class="{active: activeAddr==index || (selectedAddress && item.id == selectedAddress.id)}"
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
          <template v-for="(item, index) in regions">
            <li
              v-if="index <= level && item.name"
              :key="index"
              :class="{'selected-active': index == regions.length - 1 }"
              @click="switchDistrict(index + 1)"
            >
              {{item.name}}&nbsp
              <i class="el-icon-arrow-down"></i>
            </li>
          </template>
        </ul>
        <!-- 选择栏 -->
        <!-- :class="{'active': typeShowIndex === key}" -->
        <div>
          <ul class="address_content">
            <li
              class="address_name"
              v-for="(district, key) in districts"
              :key="district.id"
              @click="selectDistrict(district.name, district.id)"
            >{{district.name}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jdAreaTree from "@/const/jdAreaTree";
import isEqual from "lodash/isEqual";
import { findChildAddressByType } from "@/const/api";

// 拍平
function treeFlat(tree) {
  let resultArray = [];
  tree.forEach(node => {
    resultArray.push(node);
    if (node.children && node.children.length) {
      resultArray = resultArray.concat(treeFlat(node.children));
    }
  });
  return resultArray;
}
// 节点 id 映射表
function initNodeIdMap(treeArray, idMap) {
  treeArray.forEach(node => {
    idMap[node.id] = node;
  });
}

// 获取父级编码
function getParentCode(code, idMap) {
  let node = idMap[code];
  if (node && node.parentAreaId) {
    return idMap[node.parentAreaId].id;
  } else {
    return undefined;
  }
}

export default {
  name: "jd-address-select",
  props: {
    /**
     * 切换层级
     * 2 市
     * 3 区/县
     * 4 乡/镇/街道
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
      type: Object,
      default: () => {}
    },
    selectedAddress: {
      type: Object,
      default: () => {}
    },
    addressList: {
      type: Array,
      default: () => []
    },
    fourthLevelUrl: {
      type: String
    }
  },
  data() {
    return {
      districts: [],
      // typeShowIndex: 0,
      localActive: true, // 是否选择当地城市
      tagClick: 0, // 0 未点击标签 | 1 省 | 2 市 | 3 区/县 | 4 乡/镇/街道
      hasL4: this.level > 3, // 标记是否有第四级
      isMounted: false, // 初次加载
      activeAddr: null,
      regions: [],
      isShowMore: false,
      areaIdMap: {},
      areaTree: []
    };
  },
  watch: {
    location(newAddress, oldAddress) {
      if (isEqual(newAddress, oldAddress)) return;

      if (!this.isMounted) {
        this.regions;
        this.initSelected();
        this.initDistrictList();
      }
    },
    selectedAddress: {
      handler(newAddress, oldAddress) {
        if (isEqual(newAddress, oldAddress) || this.level < 3) return;

        if (this.isMounted) {
          this.$emit("selected", { level: this.level, selected: newAddress });
          return;
        }

        if (this.selectedAddress && this.selectedAddress.provinceCode) {
          this.initSelected();
          this.initDistrictList();
          this.isMounted = true;
        }
      },
      deep: true
    },
    selectedCity: {
      handler(newAddress, oldAddress) {
        this.regions;
        if (isEqual(newAddress, oldAddress) || this.level > 3) return;

        if (this.isMounted) {
          this.$emit("selected", { level: this.level, selected: newAddress });
          return;
        }

        if (this.selectedCity && this.selectedCity.provinceCode) {
          this.initSelected();
          this.initDistrictList();
          this.setAddressSelected(this.selectedCity);
          this.isMounted = true;
        }
      },
      deep: true
    }
  },
  computed: {
    locationCityName() {
      return this.location.cityName;
    }
  },
  methods: {
    closeAddressTab() {
      this.$emit("closeTab");
    },
    /**
     * 切换地区,获取本级列表
     * 前提：初始化正常
     * 1 省
     * 2 市
     * 3 县
     * 4 街道
     * @param tagLevel
     */
    async switchDistrict(tagLevel) {
      if (this.level < tagLevel) return;

      this.tagClick = tagLevel;
      this.regions.splice(tagLevel); // 保留本级tag (0,tagLevel-1)
      // 点击末级，保留 this.districts
      if (this.level == tagLevel) return;

      if (tagLevel == 1) {
        this.districts = this.areaTree.slice();
        return;
      }

      // 标签123获取本地缓存
      let code = this.regions[tagLevel - 2].code; // 取上级code
      this.districts = await this.getDistrictList(code, false);
      return;
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
     * 获取下一级行政区列表
     * @param {String} code 行政区编号
     * @param {Boolean} isAsync 异步获取数据
     * @param {Number} level 行政区等级 1 省 | 2 市 | 3 区/县 | 4 乡/镇/街道
     * @ret {Array}
     */
    async getDistrictList(code, isAsync) {
      let districts = [];
      if (!isAsync) {
        districts = this.areaIdMap[code] ? this.areaIdMap[code].children : [];
        return districts;
      }
      let res = await this.$axios.$get(this.fourthLevelUrl, {
        params: {
          parentAreaId: code
        }
      });
      districts =
        res && res.payload && res.payload && res.payload.length
          ? res.payload
          : [];
      return districts;
    },
    /**
     * 获取行政区列表
     * 依异步响应判断本级或下级列表
     * 供第3级调用
     * @param {String} currentCode 本级行政区编号
     * @param {String} parentCode 父级行政区编号
     * @ret {Array}
     */
    async getListAsync(currentCode, parentCode) {
      let list = await this.getDistrictList(currentCode, true);
      if (list && list.length) {
        this.hasL4 = true;
        return list;
      }
      list = await this.getDistrictList(parentCode, false);
      this.hasL4 = false;
      return list;
    },

    /**
     * 点击地区，加入region，获取下级
     * level 1/2/3 同步
     * level 4 异步获取
     * 与level相等更换末级
     * 前提：正确初始化
     * @param {String} name 行政区名称
     * @param {String} code 行政区编号
     */
    async selectDistrict(name, code) {
      this.level > 2
        ? // 取消地址栏高亮
          (this.activeAddr = null)
        : // 取消城市定位高亮
          (this.localActive = false);

      let regionLen = this.regions.length;
      // 末级同名标签拦截
      let preRegion = this.regions[regionLen - 1];
      if (preRegion && preRegion.code == code && regionLen == this.level) {
        this.closeAddressTab();
        return;
      }

      // 重选本级行政区
      // 场景：点击标签 或 末级
      if (!!this.tagClick || (!this.tagClick && regionLen == this.level)) {
        this.regions.splice(this.tagClick - 1);
      }

      this.regions.push({ name, code });
      regionLen = this.regions.length;
      let list = [];

      if ((this.tagClick && this.tagClick < 3) || regionLen < 3) {
        // 获取下级列表，本地
        list = await this.getDistrictList(code, false);
        this.tagClick = 0;
      } else if (
        this.tagClick == this.level ||
        (!this.tagClick && regionLen == this.level)
      ) {
        // 保留本级原列表
        list = [];
        this.tagClick = 0;
      } else if (this.level == 4 && this.tagClick == 3) {
        // 特例
        list = await this.getDistrictList(code, true);
        if (list.length) {
          this.hasL4 = true;
          this.tagClick = 0;
        } else {
          this.hasL4 = false;
          this.tagClick = 3;
        }
      } else if (this.level == 4 && !this.tagClick && regionLen == 3) {
        // 特例
        let currentCode = this.regions[regionLen - 1].code;
        let parentCode = this.regions[regionLen - 2].code;
        list = await this.getListAsync(currentCode, parentCode);
        this.tagClick = 0;
        // 归入状态 tagClick 3|level 4|
        if (!this.hasL4) this.tagClick = 3;
      } else {
        console.log("bug 遗漏");
        list = await this.getDistrictList(code, false);
        this.tagClick = 0;
      }

      if (this.hasL4 && this.tagClick == 3 && list.length) {
        this.districts = list;
      }
      if (this.hasL4 && !this.tagClick && regionLen == 3 && list.length) {
        this.districts = list;
      }
      if (this.level == 4 && regionLen < 3) {
        this.districts = list;
      }
      if (this.level < 4 && regionLen < this.level) {
        this.districts = list;
      }

      // 结束判断
      if (
        (regionLen < this.level && this.level < 4) ||
        (regionLen < 3 && this.level == 4) ||
        (regionLen == 3 && this.level == 4 && this.hasL4)
      ) {
        return;
      }

      // 选择完毕，触发事件
      let address = this.regions;
      let selected = {
        provinceName: address[0].name,
        provinceCode: address[0].code,
        cityName: address[1].name,
        cityCode: address[1].code
      };
      if (regionLen > 2) {
        // 区/县
        selected.areaCode = address[2].code;
        selected.areaName = address[2].name;
      }
      if (regionLen > 3) {
        // 街道
        selected.townCode = address[3].code;
        selected.townName = address[3].name;
      }
      this.$emit("selected", { level: this.level, selected: selected });
      this.closeAddressTab();
      return;
    },

    setAddressSelected(address) {
      this.regions = [];
      if (this.level > 0 && address.provinceCode) {
        this.regions.push({
          name: address.provinceName,
          code: address.provinceCode
        });
      }
      if (this.level > 1 && address.cityCode) {
        this.regions.push({
          name: address.cityName,
          code: address.cityCode
        });
      }
      if (this.level > 2 && address.areaCode) {
        this.regions.push({
          name: address.areaName,
          code: address.areaCode
        });
      }
      if (this.level > 3 && address.townCode) {
        this.regions.push({
          name: address.townName,
          code: address.townCode
        });
      }
    },
    // 初始化地址选择列表
    async initDistrictList() {
      let cityCode;
      if (this.level < 3) {
        cityCode = this.selectedCity && this.selectedCity.cityCode;
      } else {
        cityCode = this.selectedAddress && this.selectedAddress.cityCode;
      }
      if (!cityCode) {
        this.districts = this.areaTree.slice();
        return;
      }

      this.level < 3
        ? this.setAddressSelected(this.selectedCity)
        : this.setAddressSelected(this.selectedAddress);

      let len = this.regions.length;
      let currentCode = this.regions[len - 1].code;
      let parentCode = this.regions[len - 2].code;

      if (this.level == 4 && len == 4 && currentCode) {
        // 末级, 肯定有第4级列表
        this.districts = await this.getDistrictList(parentCode, true);
      } else if (
        (this.level == 4 && len == 4 && !currentCode) ||
        (this.level == 4 && len == 3 && currentCode)
      ) {
        // 传入只有3级
        this.districts = await this.getListAsync(currentCode, parentCode);
        if (!this.hasL4) this.tagClick = 3;
      } else if (
        (this.level == 4 && len == 3 && !currentCode) ||
        (this.level == 3 && len == 2 && !currentCode)
      ) {
        // 传入漏2级
        this.districts = await this.getDistrictList(parentCode, false);
      } else {
        // 获取本级
        this.districts = await this.getDistrictList(parentCode, false);
      }
    },
    // 初始化emit selected
    initSelected() {
      this.regions;
      let address, isEmit;
      const props = ["provinceCode", "cityCode", "areaCode", "townCode"];
      if (this.level > 2) {
        // 地址选择
        // 如果已经有选择过地址（或者默认地址），显示该地址
        if (this.selectedAddress && this.selectedAddress.provinceCode) {
          address = this.selectedAddress;
          isEmit = true;
        } else if (this.location && this.location.provinceCode) {
          address = this.location;
          isEmit = true;
        } else {
          isEmit = false;
        }
      } else {
        // 城市选择
        if (this.selectedCity && this.selectedCity.provinceCode) {
          address = this.selectedCity;
          isEmit = true;
        } else if (this.location && this.location.provinceCode) {
          address = this.location;
          isEmit = true;
        } else {
          isEmit = false;
        }
      }
      if (isEmit) {
        // this.setAddressSelected(address);
        this.$emit("selected", { level: this.level, selected: address });
      }
    }
  },
  created() {
    let tree = jdAreaTree.slice();
    let areaArray = treeFlat(tree);
    initNodeIdMap(areaArray, this.areaIdMap);
    this.areaTree = tree;
  },
  async mounted() {
    // this.initDistrictList();
    // this.initSelected();
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
