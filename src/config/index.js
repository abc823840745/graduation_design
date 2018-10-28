


let config = {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  homeName: 'student-teacher-home',
  useI18n: true,
  env: 'dev',
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://www.kaolaplay.com:7002',
    pro: 'http://www.kaolaplay.com:7002'
  },
  /**
   * @description 需要加载的插件
   */
}
export default config
