import {
  reqAdminLogin,
  reqAgentInfo,
  reqAgentLogin,
  reqCustomerInfo,
  reqCustomerLogin,
  reqLogin,
  reqUserInfo
} from '@/api/index'
import _ from 'lodash'
const actions = {
  async login({
    commit
  }, data) {
    console.log(data);
    let result = null
    // 判断角色
    if (data.role == "1") {
      result = await reqCustomerLogin({
        phone: data.phone,
        password: data.password
      });
    } else if (data.role == "2") {
      result = await reqAgentLogin({
        phone: data.phone,
        password: data.password
      });
    } else {
      result = await reqAdminLogin({
        phone: data.phone,
        password: data.password
      });
    }
    console.log(result);
    if (result.code == 1) {
      let info = {
        role: data.role,
        ...result.data
      }
      info = _.omit(info, ['token'])
      localStorage.setItem("rjdlsInfo", JSON.stringify(info))
      commit('USERINFO', info);
    } else {
      return Promise.reject(new Error("login failed"))
    }
  },

  async getUserInfo({
    commit
  }) {

    // 先从缓存获取个人用户信息
    let userinfo = JSON.parse(localStorage.getItem("rjdlsInfo"))
    // 判断是否存有用户信息
    if (userinfo) {
      commit('USERINFO', userinfo);
    } else {
      commit('USERINFO', {});
      return Promise.reject(new Error("get userinfo failed"))
    }

    // let result = null;
    // // 请求获取个人信息的id必须是自己的
    // if(params?.id === state.loginData?.id ){
    //   // 角色判断
    //   if(state.loginData.role === "1"){
    //     result = await reqCustomerInfo(params)
    //   } else if(state.loginData.role === "2"){
    //     result = await reqAgentInfo(params)
    //   }
    // }else{
    //   return Promise.reject(new Error("get userinfo failed"))
    // }

    // if(result.code == 1){
    //   commit('USERINFO',result.data);
    // }else{
    //   return Promise.reject(new Error("get userinfo failed"))
    // }
  }
}

const mutations = {
  USERINFO(state, userinfo) {
    state.userinfo = userinfo;
  }
}

const state = {
  userinfo: {}
}

const getters = {

}

export default {
  namespaced: true,
  actions,
  mutations,
  state,
  getters
}