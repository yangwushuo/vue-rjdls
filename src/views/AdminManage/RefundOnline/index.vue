<template>
  <BSCard>
    <template #content>
      <a-table
        :columns="tableConfig.columns"
        :data="tableConfig.data"
        :pagination="tableConfig.pagination"
        :loading="tableConfig.loading"
        :bordered="tableConfig.bordered"
        :stripe="tableConfig.stripe"
        :table-layout-fixed="tableConfig.tableLayoutFixed"
        @page-change="pageChange"
      >
        <template #status="data">
          <a-tag :color="getStatusObj(data.record.status).color">{{
            getStatusObj(data.record.status).text
          }}</a-tag>
        </template>
        <template #edit="data">
          <a-button-group size="mini">
            <a-popconfirm
              content="确认通过?"
              type="success"
              position="bottom"
              @ok="pass(data.record.id)"
            >
              <a-button type="primary">通过</a-button>
            </a-popconfirm>
            <a-popconfirm
              content="确认不通过?"
              type="warning"
              position="bottom"
              @ok="nopass(data)"
            >
              <a-button type="outline">不通过</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
        <template #nopass="data">
          <span
            @click="auditReasonInputStatus(data)"
            v-if="!data.record.auditReasonStatus"
            >{{ data.record.auditReason }}</span
          >
          <a-input
            @blur="auditReasonInputStatus(data)"
            size="mini"
            v-if="data.record.auditReasonStatus"
            v-model="data.record.auditReason"
            :placeholder="请填写不通过原因"
          ></a-input>
          <a-button
            v-if="
              !data.record.auditReason.length && !data.record.auditReasonStatus
            "
            size="mini"
            @click="auditReasonInputStatus(data)"
            >填写</a-button
          >
        </template>
      </a-table>
    </template>
  </BSCard>
</template>

<script>
import { reactive } from "@vue/runtime-core";
import { reqRefundApply, reqUpRefundApply } from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
export default {
  name: "RefundOnline",
  setup() {
    let tableConfig = reactive({
      columns: [
        {
          title: "Id",
          dataIndex: "id",
        },
        {
          title: "申请时间",
          dataIndex: "createTime",
          ellipsis: true,
          render: function ({ record }) {
            return timestampFormat(record.createTime);
          },
        },
        {
          title: "状态",
          dataIndex: "status",
          slotName: "status",
        },
        {
          title: "名字",
          dataIndex: "agentName",
          slotName: "agentName",
          ellipsis: true,
        },
        {
          title: "￥退款金额",
          dataIndex: "refundMoney",
          slotName: "accountBalance",
          ellipsis: true,
        },
        {
          title: "退款原因",
          dataIndex: "refundReason",
          slotName: "refundReason",
          ellipsis: true,
        },
        {
          title: "编辑",
          dataIndex: "edit",
          slotName: "edit",
        },
        {
          title: "不通过原因/通过原因(可填写)",
          dataIndex: "nopass",
          slotName: "nopass",
        },
      ],
      data: [],
      pagination: {
        total: 20,
        current: 1,
        pageSize: 20,
        defaultCurrent: 1,
      },
      loading: false,
      bordered: false,
      stripe: false,
      tableLayoutFixed: false,
    });

    function getStatusObj(status) {
      let obj = {
        color: "",
        text: "",
      };
      if (status == 0) {
        obj.text = "审核中";
        obj.color = "#ff5722";
      } else if (status == 1) {
        obj.text = "已通过";
        obj.color = "#00b42a";
      } else {
        obj.text = "未通过";
        obj.color = "#ff0000";
      }

      return obj;
    }

    initData();
    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      tableConfig.loading = true;
      reqRefundApply({
        pageNo,
        pageSize,
      }).then((res) => {
        if (res.code == 1) {
          let { records, total, current, pages } = res.data;
          tableConfig.data = records;
          tableConfig.pagination.total = total;
          tableConfig.pagination.current = current;
          tableConfig.pagination.defaultCurrent = pages;
          tableConfig.loading = false;
        }
      });
    }

    function pass(value) {
      reqUpRefundApply({
        id: value,
        status: 1,
        auditReason: "审核通过",
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "通过成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "通过失败",
          });
        });
    }

    function nopass(data) {
      reqUpRefundApply({
        id: data.record.id,
        status: 2,
        auditReason: data.record.auditReason,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "不通过成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "不通过失败",
          });
        });
    }

    function pageChange(num){
      initData(num);
    }

    function auditReasonInputStatus(data) {
      data.record.auditReasonStatus = !data.record.auditReasonStatus;
    }

    return {
      tableConfig,
      getStatusObj,
      pass,
      nopass,
      pageChange,
      auditReasonInputStatus,
    };
  },
};
</script>

<style>
</style>