import axios from 'axios';
import store from '@/store';
import { Notice } from 'iview';
const addErrorLog = errorInfo => {
  const {
    statusText,
    status,
    request: { responseURL },
  } = errorInfo;
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL,
  };
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info);
};

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
    };
    return config;
  }
  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        // 添加全局的loading...
        if (!Object.keys(this.queue).length) {
          // Spin.show() // 不建议开启，因为界面不友好
        }
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        if (res.data.status == -1) {
          Notice.error({
            title: '您没有该操作权限！',
          });
          return Promise.reject('error');
        }
        if (res.data.message === 'fail' || res.data.message === 'err') {
          Notice.error({
            title: '服务器错误，请稍后重试！',
          });
          return Promise.reject('error');
        }
        this.destroy(url);
        const { data, status } = res;
        return { data, status };
      },
      error => {
        this.destroy(url);
        addErrorLog(error.response);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    options.headers = {
      token: store.state.user.token,
      role: store.state.user.role,
    };
    return instance(options);
  }
}
export default HttpRequest;
