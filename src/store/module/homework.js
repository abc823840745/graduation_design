import {
  getTeaClassHW,
  addTeaClassHW,
  updateTeaClassHW,
  delTeaClassHW,
  teaUploadAgain,
  getStuClassHW,
  stuUploadAgain,
  stuSubmitHW,
} from '@/api/homework';

export default {
  state: {},
  getters: {},
  mutations: {
    setTeamMajor(state, major) {
      state.major = major;
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

    // 新增课时作业
    async addTeaClassHW({ commit }, obj) {
      try {
        let res = await addTeaClassHW(obj);
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

    // 删除课时作业
    async delTeaClassHW({ commit }, id) {
      try {
        let res = await delTeaClassHW(id);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 重新上传课件
    async teaUploadAgain({ commit }, obj) {
      try {
        let res = await teaUploadAgain(obj);
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
    async stuSubmitHW({ commit }, obj) {
      try {
        let res = await stuSubmitHW(obj);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
