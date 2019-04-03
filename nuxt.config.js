const resolve = require("path").resolve;

if (process.env.mode == "prod") {
  require("dotenv").config();
}

let gateway = process.env.GATEWAY || "http://malldev.gtytong.com"; //kong地址
let publicPath = process.env.PUBLIC_PATH || gateway + "/gtytong-mall-web-pc/";

let mockMemberServer = "http://levy.ren:3000/mock/308";
let mockTradeServer = "http://levy.ren:3000/mock/344";
let mockBanner = "http://levy.ren:3000/mock/290";
let mockProductServer = "http://levy.ren:3000/mock/281";
let mockShopServer = "http://levy.ren:3000/mock/326";
let mockApplication = "http://levy.ren:3000/mock/164";
let mockEvaluateCenter = "http://levy.ren:3000/mock/299";
let mockAccountCenter = "http://levy.ren:3000/mock/371";
let mockTradeCenter = "http://levy.ren:3000/mock/398";
let mockSearchCenter = "http://levy.ren:3000/mock/398";
let mockStockCenter = "http://levy.ren:3000/mock/398";

const config = {
  projectNo: "",
  aliIconFont: "//at.alicdn.com/t/font_865156_en2g7028elq.css"
};

let axios = {};

let context =
  process.env.CONTEXT && process.env.CONTEXT.length > 1
    ? `/${process.env.CONTEXT}/`
    : "/";
if (process.env.IS_PROXY > 0) {
  axios = {
    proxy: true
  };
} else {
  axios = {
    proxy: false,
    baseURL: process.env.API_SERVER
  };
}

module.exports = {
  mode: "spa",
  env: {
    PROJECT_NO: process.env.PROJECT_NO || config.projectNo,
    NO_LOGIN: process.env.NO_LOGIN,
    GATEWAY: gateway
  },
  proxy: {
    "/security": gateway,
    "/mall-deepexi-mall-config-api":
      process.env.mode == "mock" ? mockBanner : gateway,
    "/mall-deepexi-member-center":
      process.env.mode == "mock" ? mockMemberServer : gateway,
    "/mall-deepexi-trade-center":
      process.env.mode == "mock" ? mockTradeServer : gateway,
    "/mall-deepexi-product-center":
      process.env.mode == "mock" ? mockProductServer : gateway,
    "/mall-deepexi-shop-center":
      process.env.mode == "mock" ? mockShopServer : gateway,
    "/moby-application-api":
      process.env.mode == "mock" ? mockApplication : gateway,
    "/mall-deepexi-evaluate-center":
      process.env.mode == "mock" ? mockEvaluateCenter : gateway,
    "/mall-deepexi-account-center":
      process.env.mode == "mock" ? mockAccountCenter : gateway,
    "/mall-deepexi-evaluate-center":
      process.env.mode == "mock" ? mockApplication : gateway,
    "/mall-deepexi-trade-center":
      process.env.mode == "mock" ? mockTradeCenter : gateway,
    "/mall-deepexi-search-center":
      process.env.mode == "mock" ? mockSearchCenter : gateway,
    "/mall-deepexi-stock-center":
      process.env.mode == "mock" ? mockStockCenter : gateway
  },
  router: {
    middleware: ["auth"],
    base: context,
    mode: "hash"
  },
  /*
  ** Headers of the page
  */
  head: {
    title: "仲园拍卖平台",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { "http-equiv": "x-ua-compatible", content: "IE=edge, chrome=1" },
      {
        "http-equiv": "Cache-Control",
        content: "no-cache, no-store, must-revalidate"
      },
      {
        "http-equiv": "Pragma",
        content: "no-cache"
      },
      {
        "http-equiv": "Expires",
        content: "0"
      },
      {
        hid: "description",
        name: "description",
        content: "仲园拍卖平台"
      }
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "src/assets/images/myPic/logo.gif"
      },
      {
        rel: "stylesheet",
        type: "text/css",
        href: config.aliIconFont
      }
    ],
    script: [
      {
        src:
          "https://webapi.amap.com/maps?v=1.4.10&key=2951b80b69c1c4bbca360ba0dc675540"
      } /*,
      {
        src: "//gtytoss.oss-cn-hangzhou.aliyuncs.com/grayscale.js"
      }*/
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: "#1890ff"
  },
  css: [
    {
      src: "~assets/global.styl",
      lang: "stylus"
    },
    {
      src: "~assets/media.styl",
      lang: "stylus"
    }
  ],
  srcDir: "src/",
  /*
   ** Build configuration
   */
  build: {
    // vendor: ["babel-polyfill"],
    publicPath,
    extractCSS: true,
    babel: {
      plugins: [
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk"
          }
        ]
      ]

      // presets: [
      //   [
      //     "env",
      //     {
      //       targets: {
      //         browsers: [
      //           "Chrome >= 52",
      //           "FireFox >= 44",
      //           "Safari >= 7",
      //           "Explorer 11",
      //           "last 4 Edge versions"
      //         ]
      //       },
      //       useBuiltIns: true
      //     }
      //   ]
      // ],
      // ignore: ["node_modules"]
      // plugins: [
      //   "transform-decorators-legacy",
      //   "transform-class-properties",
      //   "syntax-class-properties"
      // ]

      // presets: [
      //   [
      //     "vue-app",
      //     {
      //       useBuiltIns: true,
      //       targets: { ie: 11, uglify: true }
      //     }
      //   ]
      // ]
    },
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
      // config.devtool = "source-map";
      // if (!isDev && process.env.type === "local") {
      //   config.output.publicPath = "./_nuxt/";
      // }
    }
  },
  plugins: [
    { src: "~/plugins/filter" },
    { src: "~/plugins/axios" },
    { src: "~/plugins/element-ui" },
    { src: "~/plugins/geolocation" },
    { src: "~/plugins/polyfill" }
  ],
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy"],
  axios
};
