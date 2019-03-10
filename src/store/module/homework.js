import {
  getTeaClassHW,
  getTeaSubject,
  getStuHWList,
  getStuOnlineHWList,
  addTeaClassHW,
  updateTeaClassHW,
  delTeaClassHW,
  teaUploadAgain,
  teaScoreHW,
  getTeaHW,
  getStuHW,
  getStuClassHW,
  stuUploadAgain,
  stuSubmitClassHW,
  stuSubmitOnlineHW,
  getStuOnlineSubject,
  getStuOnlineHW,
  delTeaOnlineSubject,
  delTeaOnlineHW,
  updateTeaOnlineSubject,
  updateTeaOnlineHW,
  addTeaOnlineSubject,
  addTeaOnlineHW,
  getTeaOnlineHW,
  getStuMyHWlist,
  searchMyHWlist,
  getStuScoreSubject,
  scoreOnlineHW,
  changeSubject,
  searchStuHW,
  searchMyHW,
  getTeaMainInfo,
  getStuMainInfo,
} from '@/api/homework';

export default {
  state: {
    courseList: [],
    inputInfo: [],
    originalInfo: [],
    subjectList: [],
    optionList: [],
    originInputInfo: [],
    taskCenterInfo: {
      tableData: [],
      page: 1,
      count: 0,
    },
    experMangerInfo: {
      tableData: [],
      page: 1,
      count: 0,
    },
    onlineHWInfo: {
      tableData: [],
      page: 1,
      count: 0,
    },
    stuMyHWList: {
      tableData: [],
      page: 1,
      count: 0,
    },
  },
  getters: {},
  mutations: {
    setTeamMajor(state, val) {
      state.major = val;
    },
    setInputInfo(state, val) {
      state.inputInfo = val;
    },
    setSubjectList(state, val) {
      state.subjectList = val;
    },
    setTaskCenterInfo(state, obj) {
      state.taskCenterInfo = obj;
    },
    setExperManger(state, obj) {
      state.experMangerInfo = obj;
    },
    setOnlineHWInfo(state, obj) {
      state.onlineHWInfo = obj;
    },
    setCourseList(state, arr) {
      state.courseList = arr;
    },
    setStuMyHWList(state, obj) {
      state.stuMyHWList = obj;
    },
    setOptionList(state, arr) {
      state.optionList = arr;
    },
    setOriginalInfo(state, arr) {
      state.originalInfo = arr;
    },
    setOriginInputInfo(state, arr) {
      state.originInputInfo = arr;
    },
  },
  actions: {
    /**
     *  教师端
     */

    // 查看课时作业
    async getTeaClassHW({ commit }, obj) {
      try {
        let res = await getTeaClassHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 教师查看问题
    async getTeaSubject({ commit }, id) {
      try {
        let res = await getTeaSubject(id);
        let data = res.data.data;
        let executeOnce = true;
        let inputInfo = data.reduce((arr, item, index) => {
          let optionList = [
            {
              label: 'A',
              option: item['first_option'],
            },
            {
              label: 'B',
              option: item['sec_option'],
            },
            {
              label: 'C',
              option: item['third_option'],
            },
            {
              label: 'D',
              option: item['fourth_option'],
            },
          ];

          if (item['type'] !== '填空题') {
            arr.push({
              id: item['id'],
              subject: item['context'],
              subjectType: item['type'],
              choice: item['type'] === '多选题' ? item['answer'].split(',') : item['answer'],
              optionList,
              weighting: item['grade'],
            });
          } else {
            if (executeOnce) {
              // 填空题只有一条大题，所以只执行一次
              executeOnce = false;
              let subjectLength = 0;
              let subject = data.reduce((arr, item) => {
                if (item['type'] === '填空题') {
                  // 记录填空题的题数
                  subjectLength += 1;
                  arr.push({
                    id: item['id'],
                    subject: item['context'],
                    answer: '',
                    referenceAnswer: item['answer'],
                    showCreSubjectBtn: true,
                  });
                }
                return arr;
              }, []);
              arr.push({
                subject,
                subjectType: item['type'],

                choice: item['answer'],
                optionList,
                weighting: item['grade'] * subjectLength,
              });
            }
          }
          return arr;
        }, []);
        inputInfo.forEach((item, index) => {
          item['title'] = `${index + 1}、${item['subjectType']}`;
        });
        commit('setOriginalInfo', res.data.data);
        commit('setInputInfo', inputInfo);
        return res;
      } catch (err) {
        console.error(err);
      }
    },

    // 查看作业以及问题
    async getTeaOnlineHW({ commit }, obj) {
      try {
        let res = await getTeaOnlineHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 获取学生课时作业列表(用于评分)
    async getStuHWList({ commit }, obj) {
      try {
        let res = await getStuHWList(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 获取学生在线作业作业列表(用于评分)
    async getStuOnlineHWList({ commit }, obj) {
      try {
        let res = await getStuOnlineHWList(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 新增课时作业
    async addTeaClassHW({ commit }, obj) {
      try {
        let res = await addTeaClassHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 新建在线作业
    async addTeaOnlineHW({ commit }, obj) {
      try {
        let res = await addTeaOnlineHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 新增在线作业问题
    async addTeaOnlineSubject({ commit }, obj) {
      try {
        let res = await addTeaOnlineSubject(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 更新课时作业
    async updateTeaClassHW({ commit }, obj) {
      try {
        let res = await updateTeaClassHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 更新在线作业
    async updateTeaOnlineHW({ commit }, obj) {
      try {
        let res = await updateTeaOnlineHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 更新在线作业问题
    async updateTeaOnlineSubject({ commit }, questions) {
      try {
        let res = await updateTeaOnlineSubject(questions);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 删除课时作业
    async delTeaClassHW({ commit }, id) {
      try {
        let res = await delTeaClassHW(id);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 删除在线作业
    async delTeaOnlineHW({ commit }, id) {
      try {
        let res = await delTeaOnlineHW(id);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 删除在线作业问题
    async delTeaOnlineSubject({ commit }, id) {
      try {
        let res = await delTeaOnlineSubject(id);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 重新上传课件
    async teaUploadAgain({ commit }, obj) {
      try {
        let res = await teaUploadAgain(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 课时作业评分
    async teaScoreHW({ commit }, obj) {
      try {
        let res = await teaScoreHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 获取教师发布的作业列表
    async getTeaHW({ commit }, obj) {
      try {
        let res = await getTeaHW(obj);
        let data = res.data.data.filter(item => item !== null);
        data.forEach(item => {
          item['classify'] = item['type'] === 'offline' ? '课时作业' : '在线作业';
        });
        commit('setTaskCenterInfo', {
          tableData: data,
          count: res.data.count,
          page: obj['page'] || 1,
        });
      } catch (err) {
        console.error(err);
      }
    },

    // 在线作业-教师-作业评分
    async scoreOnlineHW({ commit }, obj) {
      try {
        let res = await scoreOnlineHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 在线作业-老师-问题操作（增删改一体）
    async changeSubject({ commit }, obj) {
      try {
        let res = await changeSubject(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 教师搜索学生作业
    async searchStuHW({ commit }, obj) {
      try {
        let res = await searchStuHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 教师搜索自己的作业
    async searchMyHW({ commit }, obj) {
      try {
        let res = await searchMyHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 教师首页
    async getTeaMainInfo({ commit }, obj) {
      try {
        let res = await getTeaMainInfo(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * 学生端
     */

    // 学生首页
    async getStuMainInfo({ commit }, obj) {
      try {
        let res = await getStuMainInfo(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 查询课时作业
    async getStuClassHW({ commit }, obj) {
      try {
        let res = await getStuClassHW(obj);
        commit('setExperManger', {
          tableData: res.data.data,
          count: res.data.count,
          page: obj['page'] || 1,
        });
      } catch (err) {
        console.error(err);
      }
    },

    // 查看在线作业
    async getStuOnlineHW({ commit }, obj) {
      try {
        let res = await getStuOnlineHW(obj);
        commit('setOnlineHWInfo', {
          tableData: res.data.data,
          count: res.data.count,
          page: obj['page'] || 1,
        });
      } catch (err) {
        console.error(err);
      }
    },

    // 查看在线作业详细问题
    async getStuOnlineSubject({ commit, state }, id) {
      try {
        let res = await getStuOnlineSubject(id);
        let data = res.data.data;
        let executeOnce = true;
        let inputInfo = data.reduce((arr, item, index) => {
          let optionList = [
            {
              label: 'A',
              option: item['first_option'],
            },
            {
              label: 'B',
              option: item['sec_option'],
            },
            {
              label: 'C',
              option: item['third_option'],
            },
            {
              label: 'D',
              option: item['fourth_option'],
            },
          ];

          if (item['type'] !== '填空题') {
            arr.push({
              id: item['id'],
              subject: item['context'],
              subjectType: item['type'],
              choice: item['answer'],
              optionList,
              weighting: item['grade'],
            });
          } else {
            if (executeOnce) {
              // 填空题只有一条大题，所以只执行一次
              executeOnce = false;
              let subject = data.reduce((arr, item) => {
                if (item['type'] === '填空题') {
                  arr.push({
                    id: item['id'],
                    subject: item['context'],
                    answer: '',
                    referenceAnswer: item['answer'],
                    showCreSubjectBtn: true,
                  });
                }
                return arr;
              }, []);
              arr.push({
                subject,
                subjectType: item['type'],
                choice: item['answer'],
                optionList,
                weighting: item['grade'],
              });
            }
          }
          return arr;
        }, []);
        inputInfo.forEach((item, index) => {
          item['title'] = `${index + 1}、${item['subjectType']}`;
        });
        commit('setInputInfo', inputInfo);
      } catch (err) {
        console.error(err);
      }
    },

    // 查看评分后的作业问题
    async getStuScoreSubject({ commit }, obj) {
      try {
        let res = await getStuScoreSubject(obj);
        let data = res.data.data;
        let executeOnce = true;
        let subjectLength = 0;
        let inputInfo = data.reduce((arr, item, index) => {
          let optionList = [
            {
              label: 'A',
              option: item['first_option'],
            },
            {
              label: 'B',
              option: item['sec_option'],
            },
            {
              label: 'C',
              option: item['third_option'],
            },
            {
              label: 'D',
              option: item['fourth_option'],
            },
          ];
          if (item['type'] !== '填空题') {
            arr.push({
              id: item['id'],
              subject: item['context'],
              subjectType: item['type'],
              choice: item['stuanswer'],
              optionList,
              score: item['stugrade'],
              referenceAnswer: item['answer'],
              weighting: item['grade'],
            });
          } else {
            if (executeOnce) {
              // 填空题只有一条大题，所以只执行一次
              executeOnce = false;
              subjectLength += 1;
              let subject = data.reduce((arr, item) => {
                if (item['type'] === '填空题') {
                  arr.push({
                    id: item['id'],
                    subject: item['context'],
                    answer: item['stuanswer'],
                    referenceAnswer: item['answer'],
                    showCreSubjectBtn: true,
                  });
                }
                return arr;
              }, []);
              arr.push({
                subject,
                subjectType: item['type'],
                choice: '',
                optionList,
                score: item['stugrade'],
                weighting: item['grade'] * subjectLength,
              });
            }
          }
          return arr;
        }, []);
        inputInfo.forEach((item, index) => {
          item['title'] = `${index + 1}、${item['subjectType']}`;
        });
        commit('setInputInfo', inputInfo);
      } catch (err) {
        console.error(err);
      }
    },

    // 重新上传课件
    async stuUploadAgain({ commit }, obj) {
      try {
        let res = await stuUploadAgain(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 提交作业
    async stuSubmitClassHW({ commit }, obj) {
      try {
        let res = await stuSubmitClassHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 提交在线作业
    async stuSubmitOnlineHW({ commit }, obj) {
      try {
        let res = await stuSubmitOnlineHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 获取学生作业列表
    async getStuHW({ commit }, obj) {
      try {
        let res = await getStuHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 学生获取自己的作业列表
    async getStuMyHWlist({ commit }, obj) {
      try {
        let res = await getStuMyHWlist(obj);
        let data = res.data.data.filter(item => item !== null);
        data.forEach(item => {
          item['classify'] = item['type'] === 'offline' ? '课时作业' : '在线作业';
        });
        commit('setStuMyHWList', {
          tableData: data,
          count: res.data.count,
          page: obj['page'] || 1,
        });
      } catch (err) {
        console.error(err);
      }
    },

    // 学生搜索自己的作业
    async searchMyHWlist({ commit }, obj) {
      try {
        let res = await searchMyHWlist(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
