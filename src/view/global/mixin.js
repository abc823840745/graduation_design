import { getCourseClassList, getTeaCourseList, getStuCourseList } from '@/api/course';
import { dateFormat } from '@tools';
import { mapState, mapMutations } from 'vuex';

const myMixin = {
  computed: {
    ...mapState({
      role: state => state.user.role,
      courseList: state => state.homework.courseList,
    }),

    allCourseList() {
      return this.courseList.map(item => {
        let { name, classes, teacher } = item;
        return {
          course: name,
          stuclass: classes,
          teacher,
        };
      });
    },

    selectCourse() {
      return value => {
        return this.allCourseList.filter(item => item['course'] === value);
      };
    },
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
            size: 'small',
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
            size: 'small',
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

    // 获取课程选择列表数据
    async getCourseList(curSemester = this.getCurSchoolYear()) {
      let res = null;
      let def = [
        {
          value: '所有课程',
          label: '所有课程',
        },
      ];
      let { year, semester } = dateFormat(curSemester);
      if (this.role === 'student') {
        // TODO: 查询学生课程,接口有问题，所以暂时用假数据
        res = await getStuCourseList({
          year,
          semester,
          offset: 1,
          limit: 999,
        });
      } else {
        // 查询教师课程
        res = await getTeaCourseList({
          year,
          semester,
          offset: 1,
          limit: 999,
        });
      }
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

    // 获取课时选择列表数据
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

    // 获取表格数据
    async getTableList(apiName, page = 1) {
      this.loading = true;
      let semester = this.selectList[0]['value'];
      let course = this.selectList[1]['value'];
      let classHour = this.selectList[2]['value'];
      await this[apiName]({
        page,
        obj: course === '所有课程' ? this.allCourseList : this.selectCourse(course),
        semester,
        classHour: classHour === '所有课时' ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId,
      });
      this.loading = false;
    },

    // 选择学年
    async yearChange(apiName, value) {
      this.loading = true;
      this.resetSelList();
      let semester = value;
      let course = this.selectList[1]['value'];
      let classHour = this.selectList[2]['value'];
      await this.setCourseSelList(semester);
      await this[apiName]({
        obj: course === '所有课程' ? this.allCourseList : this.selectCourse(course),
        semester,
        classHour: classHour === '所有课时' ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId,
      });
      this.loading = false;
    },

    // 选择课程
    async courseChange(apiName, value) {
      this.loading = true;
      this.resetClassHour();
      let semester = this.selectList[0]['value'];
      let course = value;
      let classHour = this.selectList[2]['value'];
      let getId = this.courseList.reduce((arr, item) => {
        if (item['name'] === value) {
          arr.push(item['id']);
        }
        return arr;
      }, []);
      await this.setClassHourSelList(getId[0]);
      await this[apiName]({
        obj: course === '所有课程' ? this.allCourseList : this.selectCourse(course),
        semester,
        classHour: classHour === '所有课时' ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId,
      });
      this.loading = false;
    },

    // 选择学时
    async classHourChange(apiName, value) {
      this.loading = true;
      let semester = this.selectList[0]['value'];
      let course = this.selectList[1]['value'];
      let classHour = value;
      await this[apiName]({
        obj: course === '所有课程' ? this.allCourseList : this.selectCourse(course),
        semester,
        classHour: classHour === '所有课时' ? undefined : classHour,
        student: this.userName,
        stuId: this.stuId,
      });
      this.loading = false;
    },

    // 重置所有选项
    resetSelList() {
      let selectList = this.selectList;
      selectList[1]['value'] = '所有课程';
      selectList[1]['list'] = [
        {
          value: '所有课程',
          label: '所有课程',
        },
      ];
      selectList[2]['value'] = '所有课时';
      selectList[2]['list'] = [
        {
          value: '所有课时',
          label: '所有课时',
        },
      ];
      this.selectList = selectList;
    },

    // 重置所有课时
    resetClassHour() {
      let selectList = this.selectList;
      selectList[2]['value'] = '所有课时';
      selectList[2]['list'] = [
        {
          value: '所有课时',
          label: '所有课时',
        },
      ];
      this.selectList = selectList;
    },
  },
};

export default myMixin;
