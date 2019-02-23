import { getClassHomework, addClassHomework, updateClassHomework, delClassHomework } from '@/api/homework';

export default {
  state: {},
  getters: {},
  mutations: {
    setTeamMajor(state, major) {
      state.major = major;
    },
  },
  actions: {
    async getClassHomework({ commit }, obj) {
      try {
        let res = await getClassHomework(obj);
        console.log(res.data.data);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async addClassHomework({ commit }, obj) {
      try {
        let res = await addClassHomework(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async updateClassHomework({ commit }, obj) {
      try {
        let res = await updateClassHomework(obj);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },

    async delClassHomework({ commit }, id) {
      try {
        let res = await delClassHomework(id);
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },
  },
};
