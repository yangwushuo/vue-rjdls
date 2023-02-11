import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//引入 arco 
import '@arco-design/web-vue/dist/arco.css'; //样式
import ArcoVue from '@arco-design/web-vue'; //全局组件

//引入 elementui
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

//引入 icon库
import 'material-symbols';

//开启mockjs
import '@/mock/mockServer';

//全局组件
import BSCard from "@/components/BSCard";
import BSSubHeader from "@/components/BSSubHeader";
import Header from "@/components/Header";

const app = createApp(App);

// 第三方组件
app.use(ArcoVue);
app.use(ElementPlus);

// 注册 全局组件
app.component(BSCard.name, BSCard)
app.component(BSSubHeader.name, BSSubHeader)
app.component(Header.name, Header)

app.use(store);
app.use(router);
app.mount("#app");
