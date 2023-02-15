<template>
  <BSSubHeader
    icon="order_approve"
    iconClass="material-symbols-sharp"
    title="软件产品管理"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div>
        <a-table
          :bordered="tableConfig.bordered"
          :stripe="tableConfig.stripe"
          :columns="columns"
          :data="allAgentProduct"
          :loading="tableConfig.loading"
          :pagination="tableConfig.pagination"
          @page-change="pageChange"
        >
          <template #introduction="data">
            <div>
              <div>
                <a-button
                  type="outline"
                  size="small"
                  shape="round"
                  @click="detail(data)"
                  >详情</a-button
                >
              </div>
              <div></div>
            </div>
          </template>
        </a-table>
      </div>
      <div>
        <a-drawer
          :title="drawerConfig.title"
          :width="drawerConfig.width"
          v-model:visible="drawerConfig.visible"
          :footer="drawerConfig.footer"
        >
          <div v-if="drawerConfig.loading">
            <a-skeleton-line
              :rows="6"
              :line-spacing="20"
              :widths="[300, 400, 300, 400, 500, 300]"
              :animation="true"
            />
          </div>
          <div v-else>
            <a-descriptions :data="drawerConfig.data" :column="1" size="large">
              <a-descriptions-item label="产品名">
                {{ drawerConfig.data.productName }}
              </a-descriptions-item>
              <a-descriptions-item label="年费">
                {{ drawerConfig.data.annualFee }}
              </a-descriptions-item>
              <a-descriptions-item label="买断">
                {{ drawerConfig.data.perpetualFee }}
              </a-descriptions-item>
              <a-descriptions-item label="详情">
                {{ drawerConfig.data.introduction }}
              </a-descriptions-item>
              <a-descriptions-item label="使用手册下载地址">
                {{ drawerConfig.data.serviceManualLink }}
              </a-descriptions-item>
              <a-descriptions-item label="软件产品下载地址">
                {{ drawerConfig.data.productLink }}
              </a-descriptions-item>
              <a-descriptions-item label="软件产品使用地址">
                {{ drawerConfig.data.productUseLink }}
              </a-descriptions-item>
              <a-descriptions-item label="上架时间">
                {{ getFormatTime(drawerConfig.data.createTime) }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </a-drawer>
      </div>
    </template>
  </BSCard>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import store from "@/store";
import { watch } from "@vue/runtime-core";
import { reqAgentProductById } from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
export default {
  name: "AgentProductManage",
  setup() {
    const userstate = store.state.userstore;
    const drawerConfig = reactive({
      width: 700,
      visible: false,
      title: "详情",
      footer: false,
      loading: false,
      data: {},
    });
    const tableConfig = reactive({
      bordered: false,
      stripe: false,
      loading: false,
      pagination: {
        total: 20,
        current: 1,
        pageSize: 20,
        defaultCurrent: 1,
      },
    });
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
      },
      {
        title: "项目名字",
        dataIndex: "productName",
      },
      {
        title: "详情",
        dataIndex: "introduction",
        slotName: "introduction",
      },
      {
        title: "￥年费",
        dataIndex: "annualFee",
      },
      {
        title: "￥买断",
        dataIndex: "perpetualFee",
      },
    ];
    let allAgentProduct = ref([]);

    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      reqAgentProductById({
        id: userstate.userinfo.id,
        pageNo,
        pageSize,
      }).then((res) => {
        console.log(res);
        if (res.code == 1) {
          console.log(res);
          let {total, current, pages } = res.data;
          tableConfig.pagination.total = total;
          tableConfig.pagination.current = current;
          tableConfig.pagination.defaultCurrent = pages;
          allAgentProduct.value = res.data;          
          checkData();
        }
      });
    }

    function checkData() {
      allAgentProduct.value.forEach((pro) => {
        if (pro.createTime) {
          pro.createTime = timestampFormat(pro.createTime);
        }
      });
    }

    function detail(data) {
      drawerConfig.visible = true;
      drawerConfig.loading = true;
      let record = data.record;
      if (record.id) {
        let pro = allAgentProduct.value.find((pro) => {
          if (pro.id == record.id) {
            return true;
          }
        });
        drawerConfig.data = pro;
      }
      setTimeout(() => {
        drawerConfig.loading = false;
      }, 300);
    }

    function getFormatTime(ts) {
      return timestampFormat(ts);
    }

    function pageChange(num){
      initData(num);
    }

    watch(
      () => userstate.userinfo,
      (nv, ov) => {
        if (userstate.userinfo.id) {
          initData();
        }
      },
      {
        immediate: true,
      }
    );

    return {
      tableConfig,
      drawerConfig,
      columns,
      allAgentProduct,
      detail,
      getFormatTime,
      pageChange
    };
  },
};
</script>

<style>
</style>