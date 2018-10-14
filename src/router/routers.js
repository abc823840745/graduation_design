import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
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
  //学生端路由
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
      access: ['student','teacher']
    },
    children: [
      {
        path: '/home',
        name: 'student-teacher-home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home',
          access: ['student','teacher']
        },
        component: () => import('@/view/home')
      }
    ]
  },
  {
    path: '/student/personal',
    name: 'student-personal',
    meta: {
      icon: 'logo-buffer',
      title: '个人中心',
      access: ['student']
    },
    component: Main,
    children: [
      {
        path: 'student-my-info',
        name: 'student-my-info',
        meta: {
          icon: 'logo-markdown',
          title: '我的课程',
          access: ['student']
        },
        component: () => import('@/view/student/personal/my-info.vue')
      },
      {
        path: 'student-my-message',
        name: 'student-my-message',
        meta: {
          icon: 'ios-create',
          title: '其他',
          access: ['student']
        },
        component: () => import('@/view/student/personal/my-message.vue')
      }
    ]
  },
  {
    path: '/student/course',
    name: 'student-course',
    meta: {
      icon: 'logo-buffer',
      title: '课程设计',
      access: ['student']
    },
    component: Main,
    children: [
      {
        path: 'my-course',
        name: 'student-my-course',
        meta: {
          icon: 'logo-markdown',
          title: '我的课程',
          access: ['student']
        },
        component: () => import('@/view/student/course/my-course.vue')
      },
      {
        path: 'other',
        name: 'student-else',
        meta: {
          icon: 'ios-create',
          title: '其他',
          access: ['student']
        },
        component: () => import('@/view/student/course/else.vue')
      }
    ]
  },
  {
    path: '/student/homework',
    name: 'student-homework',
    meta: {
      icon: 'md-cloud-upload',
      title: '作业设计',
      access: ['student']
    },
    component: Main,
    children: [
      {
        path: 'my-homework',
        name: 'student-my-homework',
        meta: {
          icon: 'ios-document',
          title: '我的作业',
          access: ['student']
        },
        component: () => import('@/view/student/homework/my-homework.vue')
      },
      {
        path: 'other',
        name: 'student-other',
        meta: {
          icon: 'md-clipboard',
          title: '其他',
          access: ['student']
        },
        component: () => import('@/view/student/homework/other.vue')
      }
    ]
  },
  {
    path: '/student/graduation',
    name: 'student-graduation',
    meta: {
      icon: 'logo-buffer',
      title: '毕业设计',
      access: ['student']
    },
    component: Main,
    children: [
      {
        path: 'choice-teacher',
        name: 'student-choice-teacher',
        meta: {
          icon: 'md-contacts',
          title: '选择导师',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/choice-teacher.vue')
      },
      {
        path: 'choice-course',
        name: 'student-choice-course',
        meta: {
          icon: 'md-bookmark',
          title: '选择课题',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/choice-course.vue')
      },
      {
        path: 'project-report',
        name: 'student-project-report',
        meta: {
          icon: 'md-basket',
          title: '开题报告',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/project-report.vue')
      },
      {
        path: 'my-mission',
        name: 'student-my-mission',
        meta: {
          icon: 'ios-cube',
          title: '我的任务',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/my-mission.vue')
      },
      {
        path: 'submit-papper',
        name: 'student-submit-papper',
        meta: {
          icon: 'md-document',
          title: '提交论文',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/submit-papper.vue')
      },
      {
        path: 'project-manager',
        name: 'student-project-manager',
        meta: {
          icon: 'md-folder',
          title: '项目管理',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/project-manager.vue')
      },
      {
        path: 'practice-week',
        name: 'student-practice-week',
        meta: {
          icon: 'ios-clock',
          title: '实习周报',
          access: ['student']
        },
        component: () => import('@/view/student/graduation/practice-week.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  },


  //教师端路由
  {
    path: '/teacher/personal',
    name: 'teacher-personal',
    meta: {
      icon: 'logo-buffer',
      title: '个人中心',
      access: ['teacher']
    },
    component: Main,
    children: [
      {
        path: 'teacher-my-info',
        name: 'teacher-my-info',
        meta: {
          icon: 'logo-markdown',
          title: '我的信息',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/personal/my-info.vue')
      },
      {
        path: 'teacher-my-message',
        name: 'teacher-my-message',
        meta: {
          icon: 'ios-create',
          title: '我的消息',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/personal/my-message.vue')
      }
    ]
  },
  {
    path: '/teacher/course',
    name: 'teacher-course',
    meta: {
      icon: 'logo-buffer',
      title: '课程设计',
      access: ['teacher']
    },
    component: Main,
    children: [
      {
        path: 'my-course',
        name: 'teacher-my-course',
        meta: {
          icon: 'logo-markdown',
          title: '我的课程',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/course/my-course.vue')
      },
      {
        path: 'other',
        name: 'teacher-course-other',
        meta: {
          icon: 'ios-create',
          title: '其他',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/course/other.vue')
      }
    ]
  },
  {
    path: '/teacher/homework',
    name: 'teacher-homework',
    meta: {
      icon: 'md-cloud-upload',
      title: '作业管理',
      access: ['teacher']
    },
    component: Main,
    children: [
      {
        path: 'my-homework',
        name: 'teacher-my-homework',
        meta: {
          icon: 'ios-document',
          title: '我的作业',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/homework/my-homework.vue')
      },
      {
        path: 'other',
        name: 'teacher-homework-other',
        meta: {
          icon: 'md-clipboard',
          title: '其他',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/homework/other.vue')
      }
    ]
  },
  {
    path: '/teacher/graduation',
    name: 'teacher-graduation',
    meta: {
      icon: 'logo-buffer',
      title: '毕业设计',
      access: ['teacher']
    },
    component: Main,
    children: [
      {
        path: 'choice-teacher',
        name: 'teacher-choice-teacher',
        meta: {
          icon: 'md-contacts',
          title: '选择导师',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/choice-teacher.vue')
      },
      {
        path: 'choice-course',
        name: 'teacher-choice-course',
        meta: {
          icon: 'md-bookmark',
          title: '选择课题',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/choice-course.vue')
      },
      {
        path: 'project-report',
        name: 'teacher-project-report',
        meta: {
          icon: 'md-basket',
          title: '开题报告',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/project-report.vue')
      },
      {
        path: 'my-mission',
        name: 'teacher-my-mission',
        meta: {
          icon: 'ios-cube',
          title: '我的任务',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/my-mission.vue')
      },
      {
        path: 'submit-papper',
        name: 'teacher-submit-papper',
        meta: {
          icon: 'md-document',
          title: '提交论文',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/submit-papper.vue')
      },
      {
        path: 'project-manager',
        name: 'teacher-project-manager',
        meta: {
          icon: 'md-folder',
          title: '项目管理',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/project-manager.vue')
      },
      {
        path: 'practice-week',
        name: 'teacher-practice-week',
        meta: {
          icon: 'ios-clock',
          title: '实习周报',
          access: ['teacher']
        },
        component: () => import('@/view/teacher/graduation/practice-week.vue')
      }
    ]
  }
]
