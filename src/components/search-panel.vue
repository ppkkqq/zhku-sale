<template>
  <div :class="name">
    <div class="search-panel-wrap">
      <!-- 类目路径 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="breadcrumbBase.path">{{breadcrumbBase.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>
          <div class="tag-wrap" v-for="(item,index) in list" :key="index" @click="deleteTag(index)">
            {{item.key}}：{{item.val}}
            <i class="el-icon-close"></i>
          </div>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 面板 -->
      <div class="panel" v-if="panel && panel.length">
        <template v-for="(row,index1) in panel">
          <div class="row" :key="index1" :class="{'row-border': row.isMore}">
            <div class="label">{{row[labelName]}} :</div>
            <div class="item-wrap">
              <!-- :style="{'min-width': this.itemWidth}" -->
              <template v-for="(item,index2) in row[itemArrayName]">
                <div class="item" :key="index2" v-if="index2 <= 5 || row.isMore">
                  <span class="item-name" @click="onSelected(row[labelName], item)">{{item}}</span>
                </div>
              </template>
            </div>
            <div class="more-wrap" v-if="row[itemArrayName] && row[itemArrayName].length > 6">
              <div class="more" @click="onMore(row, row[itemArrayName].length > 6)">
                <span>{{row.isMore && row[itemArrayName].length > 6 ? "收起" : "更多"}}</span>
                <i
                  :class="row.isMore && row[itemArrayName].length > 6 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                ></i>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 筛选快捷栏
      <div class="sort-bar">
        <div class="sort-wrap">
          <div
            class="sort-btn"
            v-for="(opt, index) in sortOpts"
            :key="index"
            :class="[selectedSort=== opt.value ? 'active-rank' : ''] + ' rank bgf'"
            @click="goFilter(opt)"
          >
            <span>{{opt.label}}</span>
            <img
              src="../assets/images/serchShop/white-arrow.png"
              v-if="selectedSort=== opt.value&&index!==2"
            >
            <img
              src="../assets/images/serchShop/ccc-arrow.png"
              v-if="selectedSort!==opt.value&&index!==2"
            >
            <div v-if="index===2" class="arrow">
              <div
                :class="[selectedSort===opt.value&&index===2&&sort==='lowerSellPrice_asc' ?'arrow-up-on': '']+' arrow-up'"
              ></div>
              <div
                :class="[selectedSort===opt.value&&index===2&&sort==='lowerSellPrice_desc' ?'arrow-down-on': '']+' arrow-down'"
              ></div>
            </div>
          </div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import qs from "qs";
import isArray from "lodash/isArray";

const queryFlag = "?";
const queryPattern = new RegExp("\\?(.*)");
const qsOptions = {
  allowDots: true,
  arrayFormat: "indices"
};

export default {
  name: "search-panel",
  props: {
    // 面包屑，第一级,{name,path}
    breadcrumbBase: {
      type: Object,
      default: () => {}
    },
    /* 面板数据
      格式：[{name,list:[itemName,...]},...]
    */
    panel: {
      type: Array,
      default: () => [],
      required: true
    },
    // panel 的分类属性名
    labelName: {
      type: String,
      default: "name"
    },
    // panel 的分类选项数组的属性名
    itemArrayName: {
      type: String,
      default: "list"
    },
    // 重置内部状态
    reset: {
      type: Boolean,
      default: false
    }
    /* 面板选项宽
      Number Array
      按panel的行号（起始索引号0）设置各行选项宽度，
      0：默认宽度
    */
    // itemWidths: {
    //   type: Array,
    //   default: () => []
    // },
    // /**
    //  * 路由模式, hash | history || '', 决定了查询参数存放的形式, 设置为空则不存储查询参数
    //  */
    // routerMode: {
    //   type: String,
    //   default: "hash"
    // }
  },
  components: {},
  data() {
    return {
      name: "search-panel",
      // sortOpts: [
      //   { label: "综合", value: "composite" },
      //   { label: "销量", value: "salesVolume" },
      //   { label: "价格", value: "price" }
      // ],
      // selectedSort: "composite",
      // sort: "",
      // sortStatus: 0,
      list: [], // {name,path}[]
      filters: [], // {key,val}[]
      query: {} //  {page,size,sort,catalogId,search,filters}
    };
  },
  methods: {
    // 将搜索条件存入url
    setLocationHref() {
      this.query.filters = this.filters;

      let newUrl = "";
      let searchQuery = queryFlag + qs.stringify(this.query, qsOptions);

      // 非第一次查询
      if (location.href.indexOf(queryFlag) > -1) {
        newUrl = location.href.replace(queryPattern, searchQuery);
      } else if (this.routerMode == "hash") {
        let search =
          location.hash.indexOf("?") > -1
            ? `&${searchQuery}`
            : `?${searchQuery}`;
        newUrl =
          location.origin +
          location.pathname +
          location.search +
          location.hash +
          search;
      } else {
        let search = location.search ? `&${searchQuery}` : `?${searchQuery}`;
        newUrl =
          location.origin +
          location.pathname +
          location.search +
          search +
          location.hash;
      }

      history.pushState(history.state, "search", newUrl);
    },
    // TODO: 多选
    onSelected(key, val) {
      let obj = { key, val };
      this.filters.push(obj);
      this.list.push(obj);
      this.$emit("selected", this.filters);
      this.setLocationHref();
    },
    onMore(row, isSet) {
      if (!isSet) return;
      this.$set(row, "isMore", !row.isMore);
    },
    deleteTag(index) {
      this.list.splice(index, 1);
      this.filters.splice(index, 1);
      this.$emit("selected", this.filters);
      this.setLocationHref();
    },
    // 恢复查询条件
    restoreFilter() {
      let matches = queryPattern.exec(location.href);
      if (isArray(matches)) this.query = qs.parse(matches[1], qsOptions);
      Object.keys(this.query).forEach(key => {
        let filters = this.query.filters;
        if (key == "filters" && isArray(filters)) {
          this.filters = filters.slice();
          this.list = filters.slice();
        }
        this[key] = this.query[key];
      });
    },
    resetFilter() {
      let matches = queryPattern.exec(location.href);
      if (isArray(matches)) this.query = qs.parse(matches[1], qsOptions);
      this.filters = [];
      this.list = [];
      this.setLocationHref();
      this.$emit("selected", this.filters);
    }
    // // 筛选快捷栏
    // goFilter(v) {
    //   this.selectedSort = v.value;
    //   this.page = 1;
    //   switch (v.value) {
    //     case "composite":
    //       this.sort = "";
    //       break;
    //     case "salesVolume":
    //       this.sort = "";
    //       break;
    //     case "price":
    //       this.sortStatus++;
    //       this.sort =
    //         this.sortStatus % 2 == 1
    //           ? "lowerSellPrice_asc"
    //           : "lowerSellPrice_desc";
    //       break;
    //   }
    //   this.catalogId = this.$route.query.cateId;
    // }
  },
  computed: {
    href() {
      this.restoreFilter();
      return location.href;
    }
  },
  watch: {
    reset(bool) {
      if (bool) {
        this.resetFilter();
        this.$emit("reset-done");
      }
    }
  },
  mounted() {
    this.restoreFilter();
    this.$emit("selected", this.filters);
  }
};
</script>

<style lang="stylus">
$white = #fff
$red = #0f4511
$gray = #ccc

.search-panel {
  width: 100%

  .search-panel-wrap {
    width: 1200px
    margin: 20px auto
  }

  .el-breadcrumb {
    margin-bottom: 20px
  }

  .panel {
    width: 100%
    border-top: 1px solid $gray
    margin-bottom: 30px
  }

  .row {
    width: 100%
    text-align: left
    padding: 0
    border-bottom: 1px solid $gray
    display: flex
    flex-wrap: wrap
  }

  .row-border {
    border-left: 1px solid $gray
    border-right: 1px solid $gray
    box-sizing: border-box
  }

  .label {
    width: 150px
    text-align: left
    padding: 10px 10px
    background: #eee
  }

  .item-wrap {
    width: 900px
    display: flex
    flex-wrap: wrap
  }

  .item {
    width: 150px
    padding: 10px 10px
    // vertical-align: middle
    // line-height: 25px
  }

  .item-name:hover {
    color: $red
    cursor: pointer
  }

  .more-wrap {
    width: 148px
    padding: 10px 10px
    display: flex
    flex-wrap: wrap
    justify-content: flex-end
  }

  .more {
    border: 1px solid $gray
    padding: 0 4px
    cursor: pointer
    height: 25px
  }

  .more+.more {
    margin-left: 10px
  }

  .el-breadcrumb, el-breadcrumb__separator, .el-icon-arrow-right:before, .tag-wrap {
    line-height: 30px
  }

  .el-breadcrumb__item {
    display: flex
    justify-content: center
  }

  .el-breadcrumb__inner {
    display: flex
  }

  .tag-wrap {
    border: 2px solid $gray
    vertical-align: middle
    padding: 0 10px

    &:hover {
      cursor: pointer
      border: 2px solid $red
    }
  }

  .tag-wrap+.tag-wrap {
    margin-left: 10px
  }

  .el-icon-close {
    color: $red
  }
}
</style>
