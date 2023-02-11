
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import store from '@/store';

export default function usePermission() {
  const userStore = store.state.userstore;
  return {
    accessRouter(route) { // 判断当前用户是否有该路由的权限
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.userinfo.role)
      );
    },
    // You can add any rules you want
  };
}