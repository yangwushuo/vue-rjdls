import { createStore } from "vuex";
import userstore from "./userstore";
import productstore from "./productstore"

export default createStore({
  modules: {
    userstore,
    productstore
  }
});
