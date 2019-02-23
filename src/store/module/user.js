import { login, logout, getUserInfo } from '@/api/user';
import { setToken, setRole, getRole, getToken } from '@/libs/util';
export default {
  state: {
    guideTeacher: '',
    choiceBegin: '',
    year: '',
    major: '',
    phone: '',
    lesson: '',
    team_id: 0,
    msgCount: 0,
    stu_nmuber: '',
    role: getRole(),
    userName: '',
    avatorImgPath: '',
    token: getToken(),
    access: [],
    qq: '',
    hasGetInfo: false,
  },
  mutations: {
    setTeamMajor(state, major) {
      state.major = major;
    },
    setQQ(state, qq) {
      state.qq = qq;
    },
    setGuideTeacher(state, guideTeacher) {
      state.guideTeacher = guideTeacher;
    },
    setYear(state, year) {
      state.year = year;
    },
    setChoiceBegin(state, choiceBegin) {
      state.choiceBegin = choiceBegin;
    },
    setRole(state, role) {
      state.role = role;
      setRole(role);
    },
    setPhone(state, phone) {
      state.phone = phone;
    },
    setLesson(state, lesson) {
      state.lesson = lesson;
    },
    setTeamId(state, team_id) {
      state.team_id = team_id;
    },
    setMsgCount(state, count) {
      state.msgCount = count;
    },
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setStuNumber(state, stu_nmuber) {
      state.stu_nmuber = stu_nmuber;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setAccess(state, access) {
      state.access = access;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
        })
          .then(res => {
            const data = res.data;
            if (data.message == 'err') {
              reject(err);
            } else {
              commit('setToken', data.token);
              commit('setRole', data.role);
              resolve(data.token);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getAccess({ state, commit }) {
      return new Promise((resolve, reject) => {
        resolve(state.access);
      });
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('setToken', '');
            commit('setAccess', []);
            commit('setRole', '');
            resolve();
          })
          .catch(err => {
            reject(err);
          });
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      });
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token, state.role)
            .then(res => {
              if (res.data.message == 'ok') {
                const data = res.data;
                commit('setTeamId', data.team_id);
                commit('setYear', data.class);
                commit('setTeamMajor', data.major);
                commit('setGuideTeacher', data.guide_teacher);
                commit('setQQ', data.qq);
                commit('setLesson', data.lesson);
                commit('setPhone', data.phone);
                commit('setAvator', data.avator);
                commit('setUserName', data.name);
                commit('setStuNumber', data.stu_number);
                commit('setAccess', [data.access]);
                commit('setHasGetInfo', true);
                commit('setChoiceBegin', data.choiceBegin);
                resolve(data);
              } else {
                resolve('获取信息失败');
              }
            })
            .catch(err => {
              reject(err);
            });
        } catch (error) {
          reject(error);
        }
      });
    },
  },
};
