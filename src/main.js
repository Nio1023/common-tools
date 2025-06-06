import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "remixicon/fonts/remixicon.css";
import App from "./App.vue";
import router from "@/router";

const app = createApp(App);

app.use(ElementPlus);
app.use(ArcoVue);
app.use(router);
app.mount("#app");
