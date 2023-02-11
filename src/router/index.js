import {
  createRouter,
  createWebHistory
} from "vue-router";
import routes from './routers'
import store from '@/store';
import usePermission from '@/hooks/permission'


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {

  const userstore = store.state.userstore;

  //用户权限判断
  async function crossroads() {
    const Permission = usePermission();
    if (Permission.accessRouter(to)) await next();
    else {
      // 前往首个有权限的页面或者404。                
      await next('/notfound');
    }
  }

  function isLogin() {

    //判断当前页面是否需要登录
    if (!to.meta?.requiresAuth) {
      next();
    } else {

      //判断当前状态管理用户是否已经登录过
       
      if (userstore.userinfo.id) {
        return true;
      } else {
        //获取本地token
        let token = document.cookie;
        
        if (token) {
          return true;
        }else{
          localStorage.removeItem("rjdlsInfo")
          return false;
        }

      }
    }
  }

  if (isLogin()) { // 判读用户是否登录
    if (userstore.userinfo.id) { // 有角色信息表示当前用户已经登录且获取过用户信息
      crossroads();
    } else {
      try {
        await store.dispatch("userstore/getUserInfo"); // 获取用户角色信息后再进行后续跳转处理
        crossroads();
      } catch (error) {
        next({
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query
          }
        });
      }
    }
  } else {
    // 如果未登录则重定向到登录页面
    if (to.name === 'login') {
      next();
      return;
    }
    next({
      name: 'login',
      query: {
        redirect: to.name,
        ...to.query
      }
    });
  }

});

export default router;