<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header/>
      </el-header>
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
import Aside from "@/components/Aside/";
import { computed, nextTick, provide, ref } from "@vue/runtime-core";
import store from "@/store/index";

export default {
  name: "App",
  components: {
    Aside,
  },
  setup() {
    document.title = "软件代理商系统";

    return { };
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/common.scss";
@import "@/assets/font/chillax/css/chillax.css";
#nprogress .bar {
  background: #295ef3 !important;
}
.common-layout {
  & .el-container {
    min-height: 100vh;
    & .el-header {
      height: auto;
      padding: 0;
    }

    & .el-container {
      .el-main {
        overflow: auto;
        background-color: $bc2;

        & .main-wrapper {
        }
      }
    }
  }
}
</style>
