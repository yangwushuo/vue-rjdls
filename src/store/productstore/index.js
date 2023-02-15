import {
  reqCustomerAllProducts,
  reqCustomerProducts
} from '@/api/index'
import _ from 'lodash'
const actions = {
  async getProducts({
    commit
  }, data) {
    let res = await reqCustomerAllProducts(data)
    if (res.code == 1) {
      let {
        total,
        current,
        pages
      } = res.data;
      commit('PRODUCTS', res.data)
      return Promise.resolve({
        total,
        current,
        pages
      });
    } else {
      return Promise.reject(new Error("get products failed"))
    }
  },

  async getCostumerProducts({
    commit
  }, data) {
    console.log(data);
    let res = await reqCustomerProducts(data)
    if (res.code == 1) {
      let {
        total,
        current,
        pages
      } = res.data;
      commit('COSTOMERPRODUCTS', res.data)
      return Promise.resolve({
        total,
        current,
        pages
      });
    } else {
      return Promise.reject(new Error("get costumer products failed"))
    }
  }
}

const mutations = {
  PRODUCTS(state, data) {
    state.products = data
  },
  COSTOMERPRODUCTS(state, data) {
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