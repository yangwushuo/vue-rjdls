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
        <template #businessLicense="data">
          <a-button
            type="primary"
            size="mini"
            style="background-color: #ff7404"
            @click="checkBusinessLicense(data.record.businessLicense)"
            >查看资质</a-button
          >
          <a-image-preview
            :src="tableConfig.businessLicenseConfig.src"
            v-model:visible="tableConfig.businessLicenseConfig.visible"
            :show-loader="tableConfig.businessLicenseConfig.loading"
            @close="closeBusinessLicenseImage"
          />
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
            <a-popconfirm
              content="确认删除?"
              type="error"
              position="bottom"
              @ok="delApply(data.record.id)"
            >
              <a-button type="primary">删除</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
        <template #nopass="data">
          <span
            @click="auditReasonStatus(data)"
            v-if="!data.record.auditReasonStatus"
            >{{ data.record.auditReason }}</span
          >
          <a-input
            @blur="auditReasonStatus(data)"
            size="mini"
            v-if="data.record.auditReasonStatus"
            v-model="data.record.auditReason"
            :placeholder="请填写不通过原因"
          ></a-input>
          <a-button
              v-if="!data.record.auditReason?.length && !data.record.auditReasonStatus"
              size="mini"
              @click="auditReasonStatus(data)"
              >填写</a-button
            >
        </template>
      </a-table>
    </template>
  </BSCard>
</template>

<script>
import {
  reqAgentQualification,
  reqDelBusinessLicense,
  reqNoPassBusinessLicense,
  reqPassBusinessLicense,
  reqUserInfoById,
} from "@/api";
import { reactive, ref } from "@vue/runtime-core";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
import { MessageWarning } from "@/common/Message";
export default {
  name: "AgentQualification",
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
          title: "申请状态",
          dataIndex: "status",
          slotName: "status",
        },
        {
          title: "资质",
          dataIndex: "businessLicense",
          slotName: "businessLicense",
        },
        {
          title: "身份证号",
          dataIndex: "identityCard",
          ellipsis: true,
        },
        {
          title: "申请人",
          dataIndex: "customerId",
          slotName: "customerId",
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
        defaultCurrent: 1
      },
      loading: false,
      bordered: false,
      stripe: false,
      tableLayoutFixed: false,
      businessLicenseConfig: {
        visible: false,
        src: "",
        loading: false,
      },
      inputData: {
        auditReason: "",
      },
    });

    initData();
    function initData(
      pageNo=tableConfig.pagination.defaultCurrent,
      pageSize=tableConfig.pagination.pageSize
    ) {
      tableConfig.loading = true;
      reqAgentQualification({
        pageNo,
        pageSize
      })
        .then((res) => {
          if (res.code == 1) {
            let {records, total, current, pages} = res.data;
            tableConfig.data = records;
            tableConfig.pagination.total = total;
            tableConfig.pagination.current = current;
            tableConfig.pagination.defaultCurrent = pages
            rendering();
          }
        })
        .catch((err) => {});
    }

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

    function checkBusinessLicense(value) {
      tableConfig.businessLicenseConfig.visible = true;
      tableConfig.businessLicenseConfig.loading = true;
      tableConfig.businessLicenseConfig.src = value;
      tableConfig.businessLicenseConfig.loading = false;
    }

    function closeBusinessLicenseImage() {
      tableConfig.businessLicenseConfig.src = "";
    }

    function rendering() {
      let promiseList = [];
      let userIdSet = new Set(tableConfig.data.map((item) => item.customerId));

      for (let id of userIdSet) {
        promiseList.push(
          reqUserInfoById({
            id,
          })
        );
      }

      Promise.all(promiseList)
        .then((res) => {
          res.forEach((item) => {
            if (item.code == 1) {
              for (let value of tableConfig.data) {
                if (value.customerId == item.data.id) {
                  value.customerId = item.data.cuName;
                }
              }
            }
          });
          tableConfig.loading = false;
        })
        .catch((err) => {});
    }

    function pass(value) {
      reqPassBusinessLicense({
        id: value,
        status: 1,
        auditReason: "审核通过",
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
        initData();

    }

    function nopass(data) {
      if (data.record.status == 2) {
        MessageWarning({
          content: "资质已审核,请勿重复操作",
        });
        return;
      }

      if (!data.record.auditReason) {
        MessageWarning({
          content: "请填写不通过原因",
        });
        return;
      }

      reqNoPassBusinessLicense({
        id: data.record.id,
        status: 2,
        auditReason: data.record.auditReason == "审核通过" ? '审核不通过':data.record.auditReason,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            NotificationSuccess({
              title: "已不通过",
            });
            initData()
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "不通过失败",
          });
        });
        initData();
    }

    function delApply(value) {
      reqDelBusinessLicense([value])
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "删除成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "删除失败",
          });
        });
    }

    function pageChange(num){
      initData(num);
    }

    function auditReasonStatus(data){
      data.record.auditReasonStatus = !data.record.auditReasonStatus;
    }

    return {
      tableConfig,
      getStatusObj,
      checkBusinessLicense,
      closeBusinessLicenseImage,
      pass,
      nopass,
      delApply,
      pageChange,
      auditReasonStatus
    };
  },
};
</script>

<style>
</style>