<template>
  <div class="card">
    <slot name="content">

    </slot>
  </div>
</template>

<script>
export default {
  name: 'BSCard'
};
</script>

<style lang="scss" scoped>
.card {
  padding: 1rem;
  background: white;
  border-radius: 1rem;

  margin-bottom: 1rem;
}
</style>