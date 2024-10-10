import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'; 
import router from './router';
import axios from 'axios';
import api from './services/axiosInterceptor';
// import 'default-passive-events'; // xử lý tự động passive là true
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
  DatePicker,
  Radio,
  Upload,
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
  NAnchorLink,
  NUpload,
  NRate,
  NImage,
  NSlider,
  NTimeline,
  NCollapse,
  NDivider,
  NTimelineItem,
  NCollapseItem,
  NIconWrapper,
  NEllipsis,
  NGrid,
  NGridItem,
  NText,
  NLayout,
  NInputNumber,
  NColorPicker,
  NRadio,
  NRadioGroup, 
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
    NAnchorLink,
    NUpload,
    NRate,
    NImage,
    NSlider,
    NTimeline,
    NCollapse,
    NDivider,
    NTimelineItem,
    NCollapseItem,
    NIconWrapper,
    NEllipsis,
    NGrid,
    NGridItem,
    NText,
    NLayout,
    NInputNumber,
    NColorPicker,
    NRadio,
    NRadioGroup
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
app.use(DatePicker);
app.use(Radio);
app.use(Upload);
app.use(naive);
app.use( CkeditorPlugin );


app.mount('#app');
app.config.globalProperties.$message = message;
app.config.globalProperties.$api = api;
