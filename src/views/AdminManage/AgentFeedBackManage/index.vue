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
        <template #processingLevel="data">
          {{ data.record.processingLevel == 2 ? "管理员处理" : "代理商处理" }}
        </template>
        <template #edit="data">
          <a-button-group size="mini">
            <a-popconfirm
              content="确认处理?"
              type="warning"
              position="bottom"
              @ok="processed(data)"
            >
              <a-button type="primary">已处理</a-button>
            </a-popconfirm>
            <a-popconfirm
              content="确认未处理?"
              type="error"
              position="bottom"
              @ok="noprocessed(data)"
            >
              <a-button type="outline">未处理</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
      </a-table>
    </template>
  </BSCard>
</template>

<script>
import { reactive } from "@vue/runtime-core";
import {
  reqAgentInfoById,
  reqFeedBackByAdmin,
  reqUpFeedBack,
  reqUserInfoById,
} from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
export default {
  name: "AgentFeedBackManage",
  setup() {
    let tableConfig = reactive({
      columns: [
        {
          title: "Id",
          dataIndex: "id",
        },
        // {
        //   title: "申请时间",
        //   dataIndex: "createTime",
        //   ellipsis: true,
        //   render: function ({ record }) {
        //     return timestampFormat(record.createTime);
        //   },
        // },
        {
          title: "产品名",
          dataIndex: "productName",
          slotName: "productName",
        },
        {
          title: "状态",
          dataIndex: "status",
          slotName: "status",
        },
        {
          title: "处理级别",
          dataIndex: "processingLevel",
          slotName: "processingLevel",
          ellipsis: true,
        },
        {
          title: "反馈信息",
          dataIndex: "feedbackContent",
          slotName: "feedbackContent",
          tooltip: true,
          ellipsis: true,
        },
        {
          title: "代理商",
          dataIndex: "agentName",
          slotName: "agentName",
          ellipsis: true,
        },
        {
          title: "顾客",
          dataIndex: "cuName",
          slotName: "cuName",
          ellipsis: true,
        },
        {
          title: "编辑",
          dataIndex: "edit",
          slotName: "edit",
        },
      ],
      dataSource: [],
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

    initData();
    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      tableConfig.loading = true;
      reqFeedBackByAdmin({
        pageNo,
        pageSize,
      }).then((res) => {
        if (res.code == 1) {
          let { records, total, current, pages } = res.data;
          tableConfig.data = records;
          tableConfig.pagination.total = total;
          tableConfig.pagination.current = current;
          tableConfig.pagination.defaultCurrent = pages;
          tableConfig.data = JSON.parse(JSON.stringify(records));
          // rednering();
          tableConfig.loading = false;

        }
      });
    }

    function rednering() {
      let customerIdSet = new Set(
        tableConfig.dataSource.map((item) => item.customerId)
      );
      let agentIdSet = new Set(
        tableConfig.dataSource.map((item) => item.agentId)
      );
      let reqCustomerInfoPromiseList = [];
      let reqAgentInfoPromiseList = [];

      customerIdSet.forEach((id) => {
        reqCustomerInfoPromiseList.push(
          reqUserInfoById({
            id,
          })
        );
      });

      agentIdSet.forEach((id) => {
        reqAgentInfoPromiseList.push(
          reqAgentInfoById({
            id,
          })
        );
      });

      let checkCustomerInfo = Promise.all(reqCustomerInfoPromiseList).then(
        (res) => {
          for (let promiseRes of res) {
            for (let value of tableConfig.data) {
              if (value.customerId == promiseRes.data.id) {
                value.customerId = promiseRes.data.cuName;
              }
            }
          }
          return Promise.resolve();
        }
      );

      let checkAgentInfo = Promise.all(reqAgentInfoPromiseList).then((res) => {
        for (let promiseRes of res) {
          for (let value of tableConfig.data) {
            if (value.agentId == promiseRes.data.id) {
              value.agentId = promiseRes.data.agentName;
            }
          }
        }
        return Promise.resolve();
      });

      Promise.all([checkCustomerInfo, checkAgentInfo]).then((res) => {
        tableConfig.loading = false;
      });
    }

    function getStatusObj(status) {
      let obj = {
        color: "",
        text: "",
      };
      if (status == 1) {
        obj.text = "未解决";
        obj.color = "#ff5722";
      } else if (status == 2) {
        obj.text = "已解决";
        obj.color = "#00b42a";
      }

      return obj;
    }

    function processed(data) {
      reqUpFeedBack({
        id: data.record.id,
        status: 2,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "处理成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "处理失败",
          });
        });
    }

    function noprocessed(data) {
      reqUpFeedBack({
        id: data.record.id,
        status: 1,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "设置未处理成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "设置未处理失败",
          });
        });
    }

    function pageChange(num){
      initData(num);
    }

    return {
      tableConfig,
      getStatusObj,
      processed,
      noprocessed,
      pageChange
    };
  },
};
</script>

<style>
</style>