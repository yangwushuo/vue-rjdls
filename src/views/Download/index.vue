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
          <a-descriptions-item label="使用手册">
            <a-link :href="item.productLink">{{
              item.serviceManualLink
            }}</a-link></a-descriptions-item
          >
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
  <BSCard>
    <template #content>
      <div class="page">
        <div>
          <a-pagination
            :total="pageConfig.total"
            v-model:current="pageConfig.current"
            v-model:page-size="pageConfig.pageSize"
            :show-page-size="false"
            @change="pageChange"
          />
        </div>
      </div>
    </template>
  </BSCard>
</template>

<script>
import store from "@/store/index";
import { computed, watch, reactive } from "@vue/runtime-core";
import { timestampFormat } from "@/utils/timeUtil";
import { MessageWarning } from "@/common/Message";

export default {
  name: "Download",
  setup() {
    const productstore = store.state.productstore;
    const userstore = store.state.userstore;
    const pageConfig = reactive({
      total: 20,
      current: 1,
      pageSize: 20,
      defaultCurrent: 1,
    });

    watch(
      () => userstore.userinfo.id,
      (nv, ov) => {
        if (nv) {
          pageChange(pageConfig.defaultCurrent);
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

    function pageChange(num) {
      let id = userstore.userinfo.id;
      console.log(id);
      // 获取所有产品
      store
        .dispatch("productstore/getCostumerProducts", {
          customerId: id,
          pageNo: num,
          pageSize: pageConfig.pageSize,
        })
        .then((res) => {
          let { total, current, pages } = res;
          pageConfig.total = total;
          pageConfig.current = current;
          pageConfig.defaultCurrent = pages;
        })
        .catch((err) => {
          MessageWarning({
            content: "获取数据失败",
          });
        });
    }

    return {
      customerProducts,
      pageConfig,
      getFormatTime,
      pageChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
}
</style>