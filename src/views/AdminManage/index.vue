<template>
  <div class="common-layout">
    <el-container>
      <div class="aside">
        <el-aside>
          <Aside :navData="navData" />
        </el-aside>
      </div>
      <el-container>
        <el-main>
          <div class="main-wrapper">
            <!-- <el-skeleton :rows="10" animated /> -->
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Aside from "@/components/Aside";
import store from "@/store";
import { computed } from "@vue/runtime-core";
export default {
  name: "AdminManage",
  components: {
    Aside,
  },
  setup() {
    const userstate = store.state.userstore;

    const navData = computed(() => {
      if (userstate.userinfo.role == 3) {
        return require("./menus/menu.json");
      }
    });

    return {
      navData,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common.scss";
#nprogress .bar {
  background: #295ef3 !important;
}
.common-layout {
  & .el-container {
    min-height: 100vh;

    & .aside {
      & .el-aside {
        width: auto;
        margin-right: 1rem;
      }
    }

    & .el-container {
      .el-main {
        overflow: auto;
        background-color: $bc2;
        padding: 0;
        & .main-wrapper {
        }
      }
    }
  }
}
</style>