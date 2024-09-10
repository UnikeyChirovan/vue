import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import router from './router';
import axios from 'axios';
import './axiosInterceptor';
window.axios = axios;
axios.defaults.withCredentials = true;


import {
  Input,
  Drawer,
  Button,
  message,
  List,
  Menu,
  Card,
  Table,
  Avatar,
  Select,
  Checkbox,
  Modal,
  Layout,
} from 'ant-design-vue';
import {
  create,
  NButton,
  NInput,
  NMessageProvider,
  NCard,
  NSpace,
  NIcon,
  NModal,
  NFormItem,
  NForm,
  NCheckbox,
  NDropdown,
} from 'naive-ui';
import App from './App.vue';

import './reset.css';
import './static/fontawesome-free-6.6.0-web/css/all.min.css';
import 'ant-design-vue/dist/antd.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import './mystyle.css';

const naive = create({
  components: [
    NButton,
    NInput,
    NCard,
    NSpace,
    NMessageProvider,
    NIcon,
    NModal,
    NFormItem,
    NForm,
    NCheckbox,
    NDropdown,
  ],
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Input);
app.use(Button);
app.use(Card);
app.use(Table);
app.use(Drawer);
app.use(Avatar);
app.use(List);
app.use(Menu);
app.use(Select);
app.use(Checkbox);
app.use(Modal);
app.use(Layout);
app.use(naive);

app.mount('#app');
app.config.globalProperties.$message = message;
