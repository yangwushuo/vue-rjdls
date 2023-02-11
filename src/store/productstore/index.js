import {
  reqCustomerProducts,
  reqProducts
} from '@/api/index'
import _ from 'lodash'
const actions = {
  async getProducts({
    commit
  }, data) {
    let res = await reqProducts(data)
    if(res.code == 1){
      console.log(res);
      commit('PRODUCTS', res.data)
    }else{
      return Promise.reject(new Error("get products failed"))
    }
  },
  
  async getCostumerProducts({
    commit
  }, data){
    let res = await reqCustomerProducts(data)
    if(res.code == 1){
      console.log(res)
      commit('COSTOMERPRODUCTS', res.data)
    }else{
      return Promise.reject(new Error("get costumer products failed"))
    }
  }
}

const mutations = {
  PRODUCTS(state, data){ 
    state.products = data
  },
  COSTOMERPRODUCTS(state, data){
    state.costumerProducts = data
  }
}

const state = {
  products: {},
  costumerProducts: {}
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