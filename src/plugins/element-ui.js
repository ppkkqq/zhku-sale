// /**
//  * Created by levy on 2018/2/12.
//  */
// import Vue from "vue";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   Button,
//   Cascader,
//   Carousel,
//   CarouselItem,
//   Table,
//   Pagination,
//   Progress,
//   TableColumn,
//   Notification,
//   Loading,
//   Dialog,
//   MessageBox,
//   Message,
//   Radio,
//   Rate,
//   RadioGroup,
//   Checkbox,
//   Form,
//   FormItem,
//   Input,
//   Select,
//   Option,
//   DatePicker,
//   Tooltip,
//   Container,
//   Main,
//   Footer,
//   Header,
//   Menu,
//   Submenu,
//   Steps,
//   Step,
//   MenuItem,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Row,
//   Col,
//   Tabs,
//   TabPane,
//   Upload,
//   InputNumber
// } from "element-ui";
// import ElFormRenderer from "el-form-renderer";
// import ElDataTable from "el-data-table";
//
// Vue.prototype.$ELEMENT = { size: "medium" };
//
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);
// Vue.use(Button);
// Vue.use(Carousel);
// Vue.use(CarouselItem);
// Vue.use(Select);
// Vue.use(Option);
// Vue.use(DatePicker);
// Vue.use(Pagination);
// Vue.use(Progress);
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Input);
// Vue.use(Container);
// Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Header);
// // Vue.use(Aside)
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Radio);
// Vue.use(RadioGroup);
// Vue.use(Rate);
// Vue.use(Checkbox);
// // Vue.use(Switch)
// Vue.use(Loading.directive);
// Vue.use(Dialog);
// Vue.use(Tooltip);
// Vue.use(Cascader);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(Upload);
// // Vue.use(Autocomplete)
//
// // steps
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(InputNumber);
//
// Vue.component("el-form-renderer", ElFormRenderer);
// Vue.component("el-data-table", ElDataTable);
//
// Vue.prototype.$notify = Notification;
// Vue.$notify = Notification;
//
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$alert = MessageBox.alert;
// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$message = Message;

import Vue from "vue";
import Element from "element-ui";
// import InputNumber from "@/components/input-number";
// const { Notification, MessageBox, Message } = Element;
const Notification = Element.Notification;
const MessageBox = Element.MessageBox;
const Message = Element.Message;

Vue.use(Element);
// 为了修复ele-ui InputNumber 清空输入框无法显示默认值的问题
// Vue.use(InputNumber);
Vue.$message = Message;
Vue.$notify = Notification;
Vue.prototype.$notify = Notification;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
