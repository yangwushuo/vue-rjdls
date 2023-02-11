<template>
  <div class="item-wrapper">
    <span class="material-symbols-sharp">{{ icon }}</span>
    <span class="header">{{ title }}</span>
    <slot name="content"></slot>
  </div>
  <div>
    <slot name="other"></slot>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
 .item-wrapper {
  display: flex;
  align-items: center;

  & .header {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>