import { getCourseClassList, getTeaCourseList } from '@/api/course';
import { dateFormat } from '@tools';
import { mapState, mapMutations } from 'vuex';

const myMixin = {
  computed: {
    ...mapState({
      role: state => state.user.role,
    }),
  },

  methods: {
    ...mapMutations(['setCourseList']),

    btnStyle(btnTitle, h, onclick, color = 'primary') {
      return h(
        'Button',
        {
          props: {
            type: color,
            shape: 'circle',
          },
          style: {
            marginRight: '5px',
          },
          on: {
            click: onclick,
          },
        },
        btnTitle
      );
    },

    disableBtnStyle(btnTitle, h, color = 'primary') {
      return h(
        'Button',
        {
          props: {
            type: color,
            shape: 'circle',
            disabled: true,
          },
        },
        btnTitle
      );
    },

    statusBtnStyle(btnTitle, h, color = 'primary') {
      return h(
        'Tag',
        {
          props: {
            type: 'dot',
            color,
          },
        },
        btnTitle
      );
    },

    showTable(name, num) {
      let val = null;
      for (let i = 1; i <= num; i++) {
        if (this.curDirectory === i) {
          val = this[`${name}${i}`];
          break;
        }
      }
      return val;
    },

    // 学年学期选择列表
    getSchoolYear() {
      let year = parseInt(this.$store.state.user.year) || 2015;
      let schoolYearList = [];
      for (let i = 1; i <= 4; i++) {
        schoolYearList.push({
          value: `${year + i - 1}-${year + i}上学期`,
          label: `${year + i - 1}-${year + i}上学期`,
        });
        schoolYearList.push({
          value: `${year + i - 1}-${year + i}下学期`,
          label: `${year + i - 1}-${year + i}下学期`,
        });
      }
      return schoolYearList;
    },

    // 获取当前的学年学期
    getCurSchoolYear() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let semester = null;
      if (month >= 3 && month <= 7) {
        semester = '下学期';
      } else {
        semester = '上学期';
      }
      return `${year - 1}-${year}${semester}`;
    },

    // 课程选择列表
    async getCourseList(curSemester) {
      let res = null;
      if (this.role !== 'student') {
        // 查询教师课程
        let { year, semester } = dateFormat(curSemester);
        res = await getTeaCourseList({
          year,
          semester,
          offset: 1,
          limit: 999,
        });
      } else {
        // TODO: 查询学生课程
      }
      let def = [
        {
          value: '所有课程',
          label: '所有课程',
        },
      ];
      let courseList = res.data.courseList;
      let data = courseList.reduce((arr, item) => {
        arr.push({
          value: item['name'],
          label: item['name'],
        });
        return arr;
      }, def);
      this.setCourseList(courseList);
      return data;
    },

    // 周数选择列表
    getWeekList() {
      let weekList = [
        {
          value: '所有周数',
          label: '所有周数',
        },
      ];
      for (let i = 1; i <= 20; i++) {
        weekList.push({
          value: `第${i}周`,
          label: `第${i}周`,
        });
      }
      return weekList;
    },

    // 课时选择列表
    async getClassHourList(courseId) {
      let res = await getCourseClassList({
        course_id: courseId,
      });
      let def = [
        {
          value: '所有课时',
          label: '所有课时',
        },
      ];
      let courseTimeList = res.data.courseTimeList;
      let data = courseTimeList.reduce((arr, item) => {
        arr.push({
          value: item['name'],
          label: item['name'],
        });
        return arr;
      }, def);
      return data;
    },

    // 作业完成状态选择列表
    getFinishList() {
      return [
        {
          value: '所有状态',
          label: '所有状态',
        },
        {
          value: '未完成',
          label: '未完成',
        },
        {
          value: '已完成',
          label: '已完成',
        },
        {
          value: '已过期',
          label: '已过期',
        },
      ];
    },

    // 作业类型选择列表
    getClassifyList() {
      return [
        {
          value: '所有类型',
          label: '所有类型',
        },
        {
          value: '课时作业',
          label: '课时作业',
        },
        {
          value: '在线作业',
          label: '在线作业',
        },
      ];
    },

    // 获取课程选择列表
    async setCourseSelList(value) {
      let res = await this.getCourseList(value);
      let selectList = this.selectList;
      selectList[1]['list'] = res;
      this.selectList = selectList;
    },

    // 获取课时选择列表
    async setClassHourSelList(courseId) {
      let res = await this.getClassHourList(courseId);
      let selectList = this.selectList;
      selectList[2]['list'] = res;
      this.selectList = selectList;
    },
  },
};

export default myMixin;
