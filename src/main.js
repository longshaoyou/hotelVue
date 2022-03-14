import App from './App.vue'
import store from './store'
import router from './router'
import {
  Button,
  Select,
  Option,
  Row,
  Aside,
  Header,
  Main,
  Footer,
  Container,
  Col,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Message,
  MessageBox,
  Table,
  TableColumn,
  Tag,
  Descriptions,
  DescriptionsItem,
  Tooltip,
  Form,
  FormItem,
  Input,
  Radio,
  Drawer,
  Collapse,
  CollapseItem,
  Card,
  Dialog,
  Divider,
  DatePicker,
  Popconfirm,
  Pagination
} from 'element-ui';
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'
Vue.config.productionTip = false;
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Input.name, Input);
Vue.component(Aside.name, Aside);
Vue.component(Col.name, Col);
Vue.component(Row.name, Row);
Vue.component(Header.name, Header);
Vue.component(Main.name, Main);
Vue.component(Footer.name, Footer);
Vue.component(Container.name, Container);
Vue.component(Menu.name, Menu);
Vue.component(Submenu.name, Submenu);
Vue.component(MenuItemGroup.name, MenuItemGroup);
Vue.component(MenuItem.name, MenuItem);
Vue.component(Table.name, Table);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Tag.name, Tag);
Vue.component(Descriptions.name, Descriptions);
Vue.component(DescriptionsItem.name, DescriptionsItem);
Vue.component(Tooltip.name, Tooltip);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Radio.name, Radio);
Vue.component(Drawer.name, Drawer);
Vue.component(Collapse.name, Collapse);
Vue.component(CollapseItem.name, CollapseItem);
Vue.component(Card.name, Card);
Vue.component(Dialog.name, Dialog);
Vue.component(Divider.name, Divider);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Popconfirm.name, Popconfirm);
Vue.component(Pagination.name, Pagination);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.prototype.checkAxios = function (res) {
  if (res.data.code !== 200) {
    if (res.data.msg === 'Request failed with status code 401') {
      res.data.msg = '请重新登录';
      window.localStorage.clear();
      this.$router.push('/login');
    } else if (res.data.msg === 'Network Error') {
      res.data.msg = '网络错误，3秒后重试';
    } else if (res.data.code === 403) {
      this.$router.go(-1);
    }
    this.$message({
      showClose: true,
      message: res.data.msg,
      type: "error",
    });
    return false
  }
  return true
}
new Vue({
  store,
  router,
  render: h => h(App),
  mounted() {}
}).$mount('#app')