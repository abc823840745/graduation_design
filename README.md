
>课程管理系统



* 功能简介
* 路由跳转
* 状态管理
* 本地存储
* 权限控制
* 统一的UI风格
* 同时还集成了vue社区常用的插件，例如富文本编辑器、代码编辑器、excel表导入数据、百度地图、echars等，简单实用，易于配置。
 

>在开发过程中笔者注意组件化的开发方式，同时代码也注意书写风格，还结合了eslint做为语法检查的工具，通过配合`iview `框架，使页面风格十分简洁实用。


&emsp;**1、登陆页面**

登陆页面采用极简风格，只需要输入登录用户名和密码即可成功登陆（提示：如果需要注册功能或者找回密码功能只需添加相应的按钮即可
核心代码如下
```
handleSubmit({ userName, password }) {
        this.handleLogin({ userName, password }).then(res => {
          this.getUserInfo().then(res => {
            let route = this.tagNavList.filter(item => item.name === this.$config.homeName)
            this.handleCloseTag(route, 'all')
            
          })
        }).catch(()=>{
          this.$Notice.error({
            title:'用户名或密码不正确！'
          })
        })
      }
```
主要是通过在前端进行验证用户输入，然后调用`vue-router`进行保存用户的登陆状态，从而进行用户的身份验证，应为只是后台模板，为了方便大家书写自己的逻辑，笔者已经把后端代码抽离出来，如果需要后台的话这里可能还要进行异步处理，这里各位可以结合自己的需要进行配置



**2、首页**

首页主要是网站重要信息的展示，这里结合了百度的echars进行首页的展示，大家查看源码即可明白其中的配置，这里主要说一下身份验证和侧面菜单栏的展示，首先看下首页效果




页面顶部主要是个人的信息和一些提示信息，这里重要的是模板配置了面包屑导航，方便用户可以回退到历史浏览记录，在这里，我设置的默认配置是登出后清除历史浏览记录的选项，因为考虑到笔者在实际开发过程中使用到了身份验证功能，这就导致了面包屑导航的浏览记录并不适用于所有身份的用户，如需保留可以直接修改配置项，把`清除选项注释掉`就好





在首页的侧边栏菜单是根据路由配置自动生成的，大大节约了开发者的路由配置时间，同时做了用户的身份验证，这样一来开发者可以通过验证用户身份来展示不同的页面，这是一个重要的功能，这里只贴出了部分代码

 * 教学管理平台中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/locking',
    name: 'locking',
    meta: {
      title: '锁屏',
      hideInMenu: true
    },
    component: () => import('@/components/main/components/lockscreen/components/lockingPage.vue')
  },
需要注意以下几点

只有配置在根路由下的子路由才会在侧面菜单栏中显视
meta对象里面的配置一定要填写，其中`icon表示菜单栏图标`，`title表示名称`，`hideMenu表示是否显示该菜单`，`access是用户权限控制`
onRouteEnter是路由的生命周期函数，主要用于对用户的身份认证和路由过滤


**3.2 excel表导入数据，这是一个实际开发中非常实用的功能**




![图](https://user-gold-cdn.xitu.io/2018/12/25/167e3b025654d695?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)




核心代码如下

     readFile(file) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadstart = e => {
            this.setState({
                uploadLoading: false,
                tableLoading: false,
                showProgress: true
            })
        }
        reader.onprogress = e => {
            this.progressPercent = Math.round(e.loaded / e.total * 100)
        }
        reader.onerror = e => {
            message.error('文件读取出错')
        }
        reader.onload = e => {
            message.info('文件读取成功')
            const data = e.target.result
            const { results } = excel.read(data, 'array')
            let infos = []
            results.forEach((item, index) => {
                infos.push({
                    key:'key' + index,
                    time: getMyDate(new Date().getTime(),"yyyy-MM-dd"),
                    code: item['教师工号'],
                    name: item['教师姓名'],
                    major: item['负责方向'],
                    experient: item["教学经验"],
                    description: item['教师简介'],
                })

            })
            this.setState({
                newData: infos,
                uploadLoading: false,
                tableLoading: false,
                showRemoveFile: true
            })
        }
    }




以上内容就是对课程管理系统的简单介绍，比较感兴趣的开发这可以上码云[链接](https://gitee.com/zrxisme/graduation_design)上clone到本地进行开发，如果可以pr那就再好不过了，如果在开发过程中遇到问题，可以给我提issue，我一定会在第一时间解决。

`感觉您的耐性读完，谢谢！`



## 下载使用
* git clone 地址
* cnpm install
* npm run dev



### 如果遇到问题请联系我,欢迎pr哦，让我们一起加油！

qq邮箱：823840745@qq.com

