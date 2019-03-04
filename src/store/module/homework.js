import {
  getTeaClassHW,
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
} from '@/api/homework';

export default {
  state: {
    inputInfo: [],
    subjectList: [],
  },
  getters: {},
  mutations: {
    setTeamMajor(state, major) {
      state.major = major;
    },
    setInputInfo(state, inputInfo) {
      state.inputInfo = inputInfo;
    },
    setSubjectList(state, val) {
      state.subjectList = val;
    },
  },
  actions: {
    // 教师端
    // 查看课时作业
    async getTeaClassHW({ commit }, obj) {
      try {
        let res = await getTeaClassHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 查看作业以及问题
    async getTeaOnlineHW({ commit }, obj) {
      try {
        let res = await getTeaOnlineHW(obj);
        commit('setSubjectList', res.data.data);
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
    async updateTeaOnlineSubject({ commit }, obj) {
      try {
        let res = await updateTeaOnlineSubject(obj);
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
    async teaScoreHW({ commit }, id, grade) {
      try {
        let res = await teaScoreHW(id, grade);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 获取教师发布的作业列表
    async getTeaHW({ commit }, obj) {
      try {
        let res = await getTeaHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 学生端
    // 查询课时作业
    async getStuClassHW({ commit }, obj) {
      try {
        let res = await getStuClassHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 查看在线作业
    async getStuOnlineHW({ commit }, obj) {
      try {
        let res = await getStuOnlineHW(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 查看在线作业详细问题
    async getStuOnlineSubject({ commit }, obj) {
      try {
        let res = await getStuOnlineSubject(obj);
        return res.data.data;
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
  },
};
