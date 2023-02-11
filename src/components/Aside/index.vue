<template>
  <div class="wrapper">
    <el-menu
      :default-active="'' + activeIndex"
      class="el-menu-vertical-demo"
      :collapse="hideStatus"
      :collapse-transition="true"
    >
      <component
        :is="
          item.children && item.children.length > 0
            ? 'el-sub-menu'
            : 'el-menu-item'
        "
        v-for="item in navData"
        :key="item.id"
        :index="'' + item.id"
        @click="goto(item.path)"
      >
        <template v-if="item.children && item.children.length > 0" #title>
          <el-icon>
            <span class="material-symbols-sharp">{{ item.icon }}</span>
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-icon v-if="!(item.children && item.children.length > 0)">
          <span class="material-symbols-sharp">{{ item.icon }}</span>
        </el-icon>
        <template v-if="!(item.children && item.children.length > 0)" #title>
          <span>{{ item.title }}</span>
        </template>
        <template v-if="item.children && item.children.length > 0">
          <el-menu-item
            v-for="childItem in item.children"
            :index="childItem.id"
            :key="childItem.id"
          >
            <el-icon>
              <span class="material-symbols-sharp">{{ childItem.icon }}</span>
            </el-icon>
            <template #title>{{ childItem.title }}</template>
          </el-menu-item>
        </template>
      </component>
    </el-menu>
    <div class="logo">
      <div @click="hideAsideNav" v-if="navData.length">
        <div v-if="!asideStatus">
          <span class="material-symbols-sharp">navigate_before </span>
          <!-- <span>隐藏</span> -->
        </div>
        <slot v-if="asideStatus">
          <span class="material-symbols-sharp">navigate_next </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "Aside",
  props: {
    navData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const hideStatus = ref(false);
    const asideStatus = ref(false);

    const activeIndex = computed(() => {
      for (const item of props.navData) {
        if (item.path == route.path) {
          return item.id;
        }
      }
    });

    function goto(path) {
      router.push(path);
    }

    function hideAsideNav() {
      hideStatus.value = !hideStatus.value;
      asideStatus.value = !asideStatus.value;
    }

    return {
      hideStatus,
      asideStatus,
      activeIndex,
      goto,
      hideAsideNav,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common.scss";
.el-menu {
  border-right: 0 !important;
  --el-menu-active-color: #295ef3;
  --el-menu-hover-bg-color: #f0f0f0;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: #ffffff;
}

.logo:hover {
  cursor: pointer;
}

.wrapper {
  border-radius: 1rem;
  overflow: hidden;
}
</style>