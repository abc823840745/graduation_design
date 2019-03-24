import Main from '@/components/main';
import parentView from '@/components/parent-view';

/**
 * 教学管理平台中meta除了原生参数外可配置的参数:
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
      hideInMenu: true,
    },
    component: () => import('@/view/login/login.vue'),
  },
  {
    path: '/locking',
    name: 'locking',
    meta: {
      title: '锁屏',
      hideInMenu: true,
    },
    component: () => import('@/components/main/components/lockscreen/components/lockingPage.vue'),
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
      access: ['student', 'teacher'],
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
          access: ['student', 'teacher', 'admin'],
        },
        component: () => import('@/view/home'),
      },
    ],
  },
  {
    path: '/message_index',
    name: 'message_index',
    redirect: '/message',
    component: Main,
    meta: {
      title: '消息提醒',
      hideInMenu: true,
    },
    children: [
      {
        path: '/message',
        name: 'message',
        meta: {
          hideInMenu: true,
          title: '消息',
          notCache: true,
          icon: 'md-home',
          access: ['student', 'teacher', 'admin'],
        },
        component: () => import('@/view/message_index/message_index.vue'),
      },
    ],
  },
  {
    path: '/movie_index',
    name: 'movie_index',
    redirect: '/movie/detail',
    component: Main,
    meta: {
      title: '优秀毕设详情',
      hideInMenu: true,
    },
    children: [
      {
        path: '/movie/detail',
        name: 'message',
        meta: {
          hideInMenu: true,
          title: '优秀毕设详情',
          notCache: true,
          icon: 'md-home',
          access: ['student', 'teacher'],
        },
        component: () => import('@/components/main/components/movie_detail/movie_detail.vue'),
      },
    ],
  },
  //查看教师详情
  {
    path: '/detail',
    name: 'detail',
    redirect: '/teacher_detail',
    component: Main,
    meta: {
      title: '详情',
      hideInMenu: true,
    },
    children: [
      {
        path: '/teacher_detail',
        name: 'teacher_detail',
        meta: {
          hideInMenu: true,
          title: '教师详情',
          notCache: true,
          icon: 'md-home',
          access: ['student'],
        },
        component: () => import('@/components/main/components/teacher_detail/teacher_detail.vue'),
      },
    ],
  },
  //查看周报详情
  {
    path: '/student_detail',
    name: 'student_detail',
    component: Main,
    meta: {
      title: '详情',
      hideInMenu: true,
    },
    children: [
      {
        path: 'week_report',
        name: 'week_report',
        meta: {
          hideInMenu: true,
          title: '周报详情',
          notCache: true,
          icon: 'md-home',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/components/main/components/week_report_detail/week_report_detail.vue'),
      },
      {
        path: 'course_detail',
        name: 'course_detail',
        meta: {
          hideInMenu: true,
          title: '课题详情',
          notCache: true,
          icon: 'md-home',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/components/main/components/course_detail/course_detail.vue'),
      },
      {
        path: 'mission_detail',
        name: 'mission_detail',
        meta: {
          hideInMenu: true,
          title: '任务详情',
          notCache: true,
          icon: 'md-home',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/components/main/components/mission_detail/mission_detail.vue'),
      },
      {
        path: 'papper_detail',
        name: 'papper_detail',
        meta: {
          hideInMenu: true,
          title: '论文详情',
          notCache: true,
          icon: 'md-home',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/components/main/components/papper_detail/papper_detail.vue'),
      },
    ],
  },
  {
    path: '/teacher_detail',
    name: 'teacher_detail',
    component: Main,
    meta: {
      title: '详情',
      hideInMenu: true,
    },
    children: [
      {
        path: 'course_admin',
        name: 'course_admin',
        meta: {
          hideInMenu: true,
          title: '论文详情',
          notCache: true,
          icon: 'md-home',
          access: ['admin'],
        },
        component: () => import('@/components/main/components/course_detail/course_admin.vue'),
      },
      {
        path: 'papper_admin',
        name: 'papper_admin',
        meta: {
          hideInMenu: true,
          title: '导师选择详情',
          notCache: true,
          icon: 'md-home',
          access: ['admin'],
        },
        component: () => import('@/components/main/components/papper_detail/papper_admin.vue'),
      },
    ],
  },
  {
    path: '/student/personal',
    name: 'student-personal',
    meta: {
      icon: 'md-contact',
      title: '个人中心',
      access: ['student'],
    },
    component: Main,
    children: [
      {
        path: 'student-my-info',
        name: 'student-my-info',
        meta: {
          icon: 'md-list',
          title: '我的资料',
          access: ['student'],
        },
        component: () => import('@/view/student/personal/my-info.vue'),
      },
      {
        path: 'student-my-message',
        name: 'student-my-message',
        meta: {
          icon: 'ios-mail-open',
          title: '我的私信',
          access: ['student'],
        },
        component: () => import('@/view/student/personal/my-message.vue'),
      },
    ],
  },
  {
    path: '/student/course',
    name: 'student-course',
    meta: {
      icon: 'ios-book',
      title: '课程管理',
      access: ['student'],
    },
    component: Main,
    children: [
      {
        path: 'my-course',
        name: 'student-my-course',
        meta: {
          icon: 'md-bookmarks',
          title: '我的课程',
          access: ['student'],
        },
        component: () => import('@/view/student/course/my-course.vue'),
      },
      {
        path: 'course-detail/:id',
        name: 'student-my-course-detail',
        meta: {
          title: '课程详情',
          access: ['student'],
          hideInMenu: true,
          notCache: true,
        },
        component: () => import('@/view/student/course/course-detail/index.vue'),
      },
      {
        path: 'course-detail/:id/:class_id',
        name: 'student-my-course-class-detail',
        meta: {
          title: '课时详情',
          access: ['student'],
          hideInMenu: true,
          notCache: true,
        },
        component: () => import('@/view/student/course/course-detail/class-detail.vue'),
      },
      {
        path: 'answering/answer-index',
        name: 'student-answer-index',
        meta: {
          icon: 'ios-text',
          title: '课程答疑',
          access: ['student'],
        },
        component: () => import('@/view/answering/answer-index.vue'),
      },
      {
        path: 'answering/answer-detail/:id',
        name: 'student-answer-detail',
        meta: {
          title: '答疑详情',
          access: ['student'],
          hideInMenu: true,
          notCache: true,
        },
        component: () => import('@/view/answering/answer-detail.vue'),
      },
      {
        path: 'course-notes',
        name: 'course-notes',
        meta: {
          icon: 'ios-paper',
          title: '我的笔记',
          access: ['student'],
          notCache: true,
        },
        component: () => import('@/view/student/course/course-notes.vue'),
      },
    ],
  },
  {
    path: '/student/homework',
    name: 'student-homework',
    meta: {
      icon: 'ios-paper',
      title: '作业设计',
      access: ['student'],
    },
    component: Main,
    children: [
      {
        path: 'homework-main',
        name: 'student-homework-main',
        meta: {
          icon: 'ios-home',
          title: '首页',
          access: ['student'],
        },
        component: () => import('@stuHomework/page/homework-main.vue'),
      },
      {
        path: 'experimental-state',
        name: 'student-experimental-state',
        meta: {
          icon: 'ios-list-box',
          title: '作业状态',
          access: ['student'],
        },
        component: () => import('@stuHomework/page/experimental-state.vue'),
      },
      {
        path: 'experiment-management',
        name: 'student-experiment-management',
        meta: {
          icon: 'ios-keypad',
          title: '实验管理',
          notCache: false,
          access: ['student'],
        },
        component: () => import('@stuHomework/page/experiment-management.vue'),
      },
      {
        path: 'online-homework',
        name: 'student-online-homework',
        meta: {
          icon: 'ios-globe',
          title: '在线作业',
          notCache: false,
          access: ['student'],
        },
        component: () => import('@stuHomework/page/online-homework.vue'),
      },
    ],
  },
  {
    path: '/student/graduation',
    name: 'student-graduation',
    meta: {
      icon: 'logo-buffer',
      title: '毕业设计',
      access: ['student'],
    },
    component: Main,
    children: [
      {
        path: 'choice-teacher',
        name: 'student-choice-teacher',
        meta: {
          icon: 'md-contacts',
          title: '选择导师',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/choice-teacher.vue'),
      },
      {
        path: 'choice-course',
        name: 'student-choice-course',
        meta: {
          icon: 'md-bookmark',
          title: '选择课题',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/choice-course.vue'),
      },
      {
        path: 'my-mission',
        name: 'student-my-mission',
        meta: {
          icon: 'ios-cube',
          title: '我的任务',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/my-mission.vue'),
      },
      {
        path: 'submit-papper',
        name: 'student-submit-papper',
        meta: {
          icon: 'md-document',
          title: '提交论文',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/submit-papper.vue'),
      },
      {
        path: 'project-manager',
        name: 'student-project-manager',
        meta: {
          icon: 'md-folder',
          title: '项目管理',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/project-manager.vue'),
      },
      {
        path: 'practice-week',
        name: 'student-practice-week',
        meta: {
          icon: 'ios-clock',
          title: '实习周报',
          access: ['student'],
        },
        component: () => import('@/view/student/graduation/practice-week.vue'),
      },
    ],
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/401.vue'),
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/500.vue'),
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/404.vue'),
  },

  //教师端路由
  {
    path: '/teacher/main',
    name: 'teacher-main',
    meta: {
      icon: 'logo-buffer',
      title: '首页',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'teacher-main',
        meta: {
          icon: 'md-contacts',
          title: '首页',
          access: ['teacher', 'admin'],
        },
        component: () => import('@teaHomework/page/homework-main.vue'),
      },
    ],
  },
  {
    path: '/teacher/personal',
    name: 'teacher-personal',
    meta: {
      icon: 'logo-buffer',
      title: '个人中心',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: 'teacher-my-info',
        name: 'teacher-my-info',
        meta: {
          icon: 'logo-markdown',
          title: '我的信息',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/personal/my-info.vue'),
      },
      {
        path: 'teacher-my-message',
        name: 'teacher-my-message',
        meta: {
          icon: 'ios-create',
          title: '我的消息',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/personal/my-message.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin-content',
    meta: {
      icon: 'logo-buffer',
      title: '管理中心',
      access: ['admin'],
    },
    component: Main,
    children: [
      {
        path: 'permission-manager',
        name: 'permission-manager',
        meta: {
          icon: 'logo-markdown',
          title: '权限控制',
          access: ['admin'],
        },
        component: () => import('@/view/admin/permission/manager.vue'),
      },
      {
        path: 'modules-manager',
        name: 'modules-manager',
        meta: {
          icon: 'logo-markdown',
          title: '模块权限控制',
          hideInMenu: true,
          access: ['admin'],
        },
        component: () => import('@/view/admin/permission/modules.vue'),
      },
      {
        path: 'handle-manager',
        name: 'handle-manager',
        meta: {
          icon: 'logo-markdown',
          title: '模块权限控制',
          hideInMenu: true,
          access: ['admin'],
        },
        component: () => import('@/view/admin/permission/handle.vue'),
      },
      {
        path: 'teacher-manager',
        name: 'teacher-manager',
        meta: {
          icon: 'logo-markdown',
          title: '教师管理',
          access: ['admin'],
        },
        component: () => import('@/view/admin/graduation/teacher-manager.vue'),
      },
      {
        path: 'time-manager',
        name: 'time-manager',
        meta: {
          icon: 'ios-create',
          title: '时间管理',
          access: ['admin'],
        },
        component: () => import('@/view/admin/graduation/time-manager.vue'),
      },
      {
        path: 'movie-manager',
        name: 'movie-manager',
        meta: {
          icon: 'ios-create',
          title: '优秀毕设管理',
          access: ['admin'],
        },
        component: () => import('@/view/admin/graduation/movie-manager.vue'),
      },
    ],
  },
  {
    path: '/teacher/course',
    name: 'teacher-course',
    meta: {
      icon: 'logo-buffer',
      title: '课程设计',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: 'my-course',
        name: 'teacher-my-course',
        meta: {
          icon: 'logo-markdown',
          title: '我的课程',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/course/my-course.vue'),
      },
      {
        path: 'my-course-detail/:id',
        name: 'teacher-my-course-detail',
        meta: {
          icon: 'logo-markdown',
          title: '课程详情',
          access: ['teacher', 'admin'],
          hideInMenu: true,
        },
        component: () => import('@/view/teacher/course/my-course-detail.vue'),
      },
      {
        path: 'my-course-detail/:id/:class_id',
        name: 'teacher-my-course-class',
        meta: {
          icon: 'logo-markdown',
          title: '课时详情',
          access: ['teacher', 'admin'],
          hideInMenu: true,
        },
        component: () => import('@/view/teacher/course/my-course-class.vue'),
      },
    ],
  },
  {
    path: '/teacher/answering',
    name: 'teacher-answering',
    meta: {
      icon: 'logo-buffer',
      title: '答疑管理',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'teacher-answer-index',
        meta: {
          icon: 'md-contacts',
          title: '答疑管理',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/answering/answer-index.vue'),
      },
      {
        path: 'detail/:id',
        name: 'teacher-answer-detail',
        meta: {
          icon: 'md-contacts',
          title: '答疑管理',
          access: ['teacher', 'admin'],
          hideInMenu: true,
        },
        component: () => import('@/view/teacher/answering/answer-detail.vue'),
      },
    ],
  },
  {
    path: '/teacher/homework',
    name: 'teacher-homework',
    meta: {
      icon: 'logo-buffer',
      title: '作业管理',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: 'homework-main',
        name: 'teacher-homework-main',
        meta: {
          icon: 'ios-home',
          title: '首页',
          access: ['teacher', 'admin'],
        },
        component: () => import('@teaHomework/page/homework-main.vue'),
      },
      {
        path: 'homework-create',
        name: 'teacher-homework-create',
        meta: {
          icon: 'ios-add-circle',
          title: '新建作业',
          access: ['teacher', 'admin'],
        },
        component: () => import('@teaHomework/page/homework-create.vue'),
      },
      {
        path: 'check-homework',
        name: 'teacher-check-homework',
        meta: {
          icon: 'ios-brush',
          title: '作业评分',
          access: ['teacher', 'admin'],
        },
        component: () => import('@teaHomework/page/check-homework.vue'),
      },
      {
        path: 'task-center',
        name: 'teacher-task-center',
        meta: {
          icon: 'ios-list-box',
          title: '任务中心',
          access: ['teacher', 'admin'],
        },
        component: () => import('@teaHomework/page/task-center.vue'),
      },
    ],
  },
  {
    path: '/teacher/graduation',
    name: 'teacher-graduation',
    meta: {
      icon: 'logo-buffer',
      title: '毕业设计',
      access: ['teacher', 'admin'],
    },
    component: Main,
    children: [
      {
        path: 'choice-teacher',
        name: 'teacher-choice-teacher',
        meta: {
          icon: 'md-contacts',
          title: '选择导师',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/graduation/choice-teacher.vue'),
      },
      {
        path: 'project-report',
        name: 'teacher-project-report',
        meta: {
          icon: 'md-basket',
          title: '开题报告',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/graduation/project-report.vue'),
      },
      {
        path: 'my-mission',
        name: 'teacher-my-mission',
        meta: {
          icon: 'ios-cube',
          title: '我的任务',
          access: ['teacher', 'admin'],
        },
        component: () => import('@/view/teacher/graduation/my-mission.vue'),
      },
    ],
  },
];
