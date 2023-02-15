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
        <template #awardStatus="data">
          <a-tag :color="getStatusObj(data.record.awardStatus).color">{{
            getStatusObj(data.record.awardStatus).text
          }}</a-tag>
        </template>
        <template #edit="data">
          <a-button-group size="mini">
            <a-popconfirm
              content="确认返现?"
            type="success"
              position="bottom"
              @ok="pass(data.record.id)"
            >
              <a-button type="primary">通过返现</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
      </a-table>
    </template>
  </BSCard>
</template>

<script>
import { reactive, ref } from "@vue/runtime-core";
import { reqCooperation, reqUpCooperation } from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from '@/common/Notification';
export default {
  name: "CooperationRules",
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
          title: "返现状态",
          dataIndex: "awardStatus",
          slotName: "awardStatus",
        },
        {
          title: "代理商名字",
          dataIndex: "agentName",
          slotName: "agentName",
          ellipsis: true,
        },
        {
          title: "￥返现金额",
          dataIndex: "awardMoney",
          slotName: "awardMoney",
          ellipsis: true,
        },
        {
          title: "￥总销售额",
          dataIndex: "totalSales",
          slotName: "totalSales",
          ellipsis: true,
        },
        {
          title: "编辑",
          dataIndex: "edit",
          slotName: "edit",
        },
      ],
      data: [],
      pagination: {
        total: 20,
        current: 1,
        pageSize: 20,
        defaultCurrent: 1
      },
      loading: false,
      bordered: false,
      stripe: false,
      tableLayoutFixed: false,
    });

    initData();
    function initData(      pageNo=tableConfig.pagination.defaultCurrent,
      pageSize=tableConfig.pagination.pageSize) {
      tableConfig.loading = true;
      reqCooperation({
        pageNo,
        pageSize
      }).then((res) => {
        if (res.code == 1) {
          let {records, total, current, pages} = res.data;
            tableConfig.data = records;
            tableConfig.pagination.total = total;
            tableConfig.pagination.current = current;
            tableConfig.pagination.defaultCurrent = pages
          tableConfig.loading = false;
        }
      });
    }

    function getStatusObj(status) {
      let obj = {
        color: "",
        text: "",
      };
      if (status == 1) {
        obj.text = "已返现";
        obj.color = "#00b42a";
      } else {
        obj.text = "未返现";
        obj.color = "#ff0000";
      }

      return obj;
    }

    function pass(value){
      reqUpCooperation({
        id: value
      }).then(res => {
        if(res.code == 1){
          NotificationSuccess({
            title: '返现成功'
          })
          initData();
        }else{
          return Promise.reject();
        }
      }).catch(err => {
        NotificationError({
          title: '返现失败'
        })
      })
    }

    function pageChange(num){
      initData(num);
    }

    return {
      tableConfig,
      getStatusObj,
      pass,
      pageChange
    };
  },
};
</script>

<style>
</style>