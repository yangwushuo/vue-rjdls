<template>
  <BSSubHeader
    icon="download"
    iconClass="material-symbols-sharp"
    title="下载专区"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div>
        <a-descriptions
          style="padding: 1rem"
          v-for="(item, index) in customerProducts"
          bordered
          align="left"
          table-layout="auto"
          :key="index"
          :column="1"
          size="large"
        >
          <a-descriptions-item label="产品名">
            {{ item.productName }}
          </a-descriptions-item>
          <a-descriptions-item v-if="item.permission == 2" label="产品下载地址">
            <a-link :href="item.productLink">{{
              item.productLink
            }}</a-link></a-descriptions-item
          >
          <a-descriptions-item v-else label="产品使用地址">
            <a-link :href="item.productUseLink">{{
              item.productUseLink
            }}</a-link>
          </a-descriptions-item>
          <a-descriptions-item label="使用">
            {{ item.permission == 2 ? "一次性买断" : "年费" }}
          </a-descriptions-item>
          <a-descriptions-item label="产品使用结束时间">
            {{ getFormatTime(item.endTime) }}</a-descriptions-item
          >
        </a-descriptions>
      </div>
    </template>
  </BSCard>
</template>

<script>
import store from "@/store/index";
import { computed, watch } from "@vue/runtime-core";
import { timestampFormat } from "@/utils/timeUtil";
export default {
  name: "Download",
  setup() {
    const productstore = store.state.productstore;
    const userstore = store.state.userstore;

    watch(
      () => userstore.userinfo.id,
      (nv, ov) => {
        if (nv) {
          console.log(nv);
          store.dispatch("productstore/getCostumerProducts", {
            customerId: nv,
            pageNo: 1,
            pageSize: 999,
          });
        }
      },
      {
        immediate: true,
      }
    );

    const customerProducts = computed(() => {
      return productstore.costumerProducts.records;
    });

    function getFormatTime(ts) {
      return timestampFormat(ts);
    }

    return {
      customerProducts,
      getFormatTime,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>