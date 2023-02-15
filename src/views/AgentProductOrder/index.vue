<template>
  <BSSubHeader
    icon="description"
    iconClass="material-symbols-sharp"
    title="客户订单"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div>
        <a-table
          :bordered="tableConfig.bordered"
          :stripe="tableConfig.stripe"
          :columns="tableConfig.columns"
          :data="tableConfig.data"
          :loading="tableConfig.loading"
          :pagination="tableConfig.pagination"
          :table-layout-fixed="tableConfig.tableLayoutFixed"
          @page-change="pageChange"
        >
          <template #audit="data">
            <div>
              <a-tag :color="data.record.audit ? '#00b42a' : '#ff0000'">{{
                data.record.audit ? "已通过" : "未通过"
              }}</a-tag>
            </div>
          </template>
          <template #permission="data">
            <div>
              {{ data.record.permission == 2 ? "买断" : "年费" }}
            </div>
          </template>
          <template #edit="data">
            <div>
              <a-button v-if="!data.record.audit" type="primary" size="mini" @click="pass(data)">通过</a-button>
            </div>
          </template>
        </a-table>
      </div>
    </template>
  </BSCard>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import { reqAgentProductOrder, reqUpCustomerOrder } from "@/api";
import store from "@/store";
import { watch } from "@vue/runtime-core";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";

export default {
  name: "AdminProductOrder",
  setup() {
    const userstate = store.state.userstore;
    const tableConfig = reactive({
      bordered: false,
      stripe: false,
      loading: false,
      tableLayoutFixed: false,
      pagination: {
        total: 20,
        current: 1,
        pageSize: 20,
        defaultCurrent: 1,
      },
      data: [],
      columns: [
        {
          title: "Id",
          dataIndex: "id",
        },
        {
          title: "状态",
          dataIndex: "audit",
          slotName: "audit",
        },
        {
          title: "项目名字",
          dataIndex: "productName",
          ellipsis: true,
        },
        {
          title: "支付情况",
          dataIndex: "permission",
          slotName: "permission",
        },
        {
          title: "客户",
          dataIndex: "cuName",
          slotName: "cuName",
        },
        {
          title: "￥费用",
          dataIndex: "cost",
        },
        {
          title: "编辑",
          slotName: "edit",
        },
      ],
    });

    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      reqAgentProductOrder({
        agentId: userstate.userinfo.id,
        pageNo,
        pageSize,
      }).then((res) => {
        if (res.code == 1) {
          let { total, current, pages, records } = res.data;
          tableConfig.pagination.total = total;
          tableConfig.pagination.current = current;
          tableConfig.pagination.defaultCurrent = pages;
          tableConfig.data = records;
        }
      });
    }

    function pageChange(num) {
      initData(num);
    }

    function pass(data){
      reqUpCustomerOrder({
        orderId: data.record.id,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "已通过",
            });
            initData()
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "通过失败",
          });
        });
        initData(tableConfig.pagination.current);
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
      pageChange,
      pass
    };
  },
};
</script>

<style>
</style>