// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import i18n from '@/locale';
import config from '@/config';
import * as myTools from '@tools';
import importDirective from '@/directive';
import installPlugin from '@/plugin';
import 'iview/dist/styles/iview.css';
import './index.less';
import '@/assets/icons/iconfont.css';
/* eslint-disable */
import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
Vue.use(VideoPlayer);
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value),
});

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
/**
 * @description 全局注册工具函数
 */
Vue.prototype.$tools = myTools;
/**
 * 注册指令
 */
importDirective(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App),
});
