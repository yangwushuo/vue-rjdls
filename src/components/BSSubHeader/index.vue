<template>
  <div class="sub-header">
    <div class="icon">
      <span :class="iconClass">{{ icon }}</span>
    </div>
    <div class="title">
      <span>{{ title }}</span>
    </div>
    <div class="other">
      <slot name="other"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BSSubHeader",
  props: {
    icon: {
      type: String,
    },
    iconClass: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  setup(props) {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/common.scss";
.sub-header {
  display: flex;
  align-items: center;
  padding: 0 1rem 1rem 1rem;

  & .icon {
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  & .title {
    font-size: 1.4rem;
  }

  & .other {
    width: 100%;
    padding: 0 1rem;
    display: flex;
    flex: 1;
    align-items: center;
  }
}
</style>