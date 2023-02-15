<template>
  <div class="header-wrapper">
    <div class="left-wrapper">
      <div class="project-title" @click="goRoute('/')">
        <span id="title">RJDLS</span>
        <span class="material-symbols-sharp">touch_app</span>
      </div>
      <div class="menu">
        <a-menu
          mode="horizontal"
          style="height: 100%"
          :selected-keys="parentPathNow"
        >
          <a-menu-item
            v-for="item in navInfo.nav"
            :key="item.name"
            @click="goRoute(item.route, item.id)"
            >{{ item.text }}</a-menu-item
          >
        </a-menu>
      </div>
    </div>
    <div class="right-wrapper">
      <div v-if="userinfo.id" class="isLogin">
        <div class="btns">
          <!-- <span class="material-symbols-sharp">notifications</span> -->
        </div>
        <div class="portrait">
          <a-dropdown trigger="hover">
            <el-avatar :src="userinfo.avatar" />
            <template #content>
              <a-doption @click="goto('/userc')">
                <template #icon>
                  <span class="material-symbols-sharp">person</span>
                </template>
                <template #default>个人中心</template>
              </a-doption>
              <a-doption
                @click="goto(item.route)"
                v-for="item in navInfo.pop"
                :key="item.route"
              >
                <template #icon>
                  <span class="material-symbols-sharp">{{ item.icon }}</span>
                </template>
                <template #default>{{ item.text }}</template>
              </a-doption>
              <a-doption @click="logout">
                <template #icon>
                  <span class="material-symbols-sharp" style="color: #eb2226"
                    >logout</span
                  >
                </template>
                <template #default>退出登录</template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
        <div class="nickname">
          <a-tag size="large" color="arcoblue" bordered>
            <template #icon>
              <icon-user />
            </template>
            {{
              userinfo.cuName || userinfo.agentName || userinfo.adminName
            }}</a-tag
          >
        </div>
      </div>
      <div class="login" v-if="!userinfo.id">
        <a-button type="primary" shape="round" @click="goLogin"
          ><template #icon> <IconExport /> </template
          ><template #default>登录</template></a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject} from "@vue/runtime-core";
import store from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import { IconExport, IconUser } from "@arco-design/web-vue/es/icon";
export default {
  name: "Header",
  components: { IconExport, IconUser },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const userstore = store.state.userstore;

    store.dispatch("userstore/getUserInfo");

    const userinfo = computed(() => {
      return {
        ...userstore.userinfo,
      };
    });

    const parentPathNow = computed(() => {
      if (route.matched[0]) {
        return route.matched[0].name;
      }
    });

    const navInfo = computed(() => {
      if (userstore.userinfo.role == "1") {
        return require("./menus/customer.json");
      } else if (userstore.userinfo.role == "2") {
        return require("./menus/agent.json");
      } else if (userstore.userinfo.role == "3") {
        return require("./menus/admin.json");
      } else {
        return require("./menus/other.json");
      }
    });

    function goto(path) {
      router.push(path);
    }

    function logout() {
      console.log("退出登录");
      document.cookie =
        "satoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      //重新刷新页面
      localStorage.removeItem("rjdlsInfo");
      store.dispatch("userstore/getUserInfo").then(res => {
        router.push('/')
      }).catch(err => {
        router.push('/')
      })
    }

    function goLogin() {
      router.push("/login");
    }

    function goRoute(route) {
      router.push(route);
    }

    return {
      userinfo,
      navInfo,
      parentPathNow,
      goto,
      logout,
      goLogin,
      goRoute,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common.scss";
.header-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & .left-wrapper {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    padding: 0 1rem;

    & .menu {
      flex: 1;
    }

    & .project-title {
      cursor: pointer;
      font-size: 1.2rem;
      font-family: "Chillax-Bold";
      display: flex;
      align-items: center;
    }
  }

  & .right-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;

    & .isLogin {
      display: flex;
      flex-direction: row;
      align-items: center;

      & .btns {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 10px;
      }

      & .portrait {
        padding: 0 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .el-avatar {
          box-shadow: rgba(0, 0, 0, 0.02) 0px 3px 3px 0px,
            rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
        }
      }

      & .nickname {
        color: $fontc1;
        font-size: 16px;
        font-family: "微软雅黑";
        font-weight: bold;
        padding: 0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    & .login {
      padding: 0 10px;

      & .login-text {
        display: flex;
        align-items: center;
        color: white;
      }
    }
  }
}
</style>