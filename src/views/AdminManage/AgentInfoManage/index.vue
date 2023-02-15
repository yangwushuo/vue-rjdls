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
        <template #agentName="data">
          <a-image
            style="border-radius: 50%"
            width="30"
            :preview="true"
            :fit="cover"
            :src="data.record.avatar"
          ></a-image>
          <div style="margin-left: 1rem; display: inline-block">
            <span
              @click="nameInputStatusExchange(data)"
              v-if="!data.record.nameInputStatus"
              >{{ data.record.agentName }}</span
            >
            <a-input
              style="width: 6rem"
              @blur="nameInputStatusExchange(data)"
              size="mini"
              v-if="data.record.nameInputStatus"
              v-model="data.record.agentName"
              :placeholder="姓名"
            ></a-input>
            <a-button
              v-if="
                !data.record.agentName.length && !data.record.nameInputStatus
              "
              size="mini"
              @click="nameInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #phone="data">
          <div>
            <span
              @click="phoneInputStatusExchange(data)"
              v-if="true"
              >{{ data.record.phone }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="phoneInputStatusExchange(data)"
              size="mini"
              v-if="false"
              v-model="data.record.phone"
              :placeholder="手机号"
            ></a-input>
            <a-button
              v-if="false && !data.record.phoneInputStatus"
              size="mini"
              @click="phoneInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #accountBalance="data">
          <div>
            <span
              @click="balanceInputStatusExchange(data)"
              v-if="!data.record.balanceInputStatus"
              >{{ data.record.accountBalance }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="balanceInputStatusExchange(data)"
              size="mini"
              v-if="data.record.balanceInputStatus"
              v-model="data.record.accountBalance"
              :placeholder="余额"
            ></a-input>
            <a-button
              v-if="
                data.record.accountBalance == null &&
                !data.record.balanceInputStatus
              "
              size="mini"
              @click="balanceInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #password="data">
          <div>
            <span
              @click="passwordInputStatusExchange(data)"
              v-if="!data.record.passwordInputStatus"
              >{{ data.record.password }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="passwordInputStatusExchange(data)"
              size="mini"
              v-if="data.record.passwordInputStatus"
              v-model="data.record.password"
              :placeholder="密码"
            ></a-input>
            <a-button
              v-if="
                !data.record.password.length && !data.record.passwordInputStatus
              "
              size="mini"
              @click="passwordInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #edit="data">
          <a-button-group size="mini">
            <a-popconfirm
              content="确认修改?"
              type="warning"
              position="bottom"
              @ok="sumbitUpAgentInfo(data)"
            >
              <a-button type="primary">修改</a-button>
            </a-popconfirm>
            <a-popconfirm
              content="确认删除?"
              type="error"
              position="bottom"
              @ok="delApply(data.record.id)"
            >
              <a-button type="outline">删除</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
      </a-table>
    </template>
  </BSCard>
</template>

<script>
import { reactive } from "@vue/runtime-core";
import { reqAgentInfo, reqDelAgent, reqUpAgentInfo } from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
export default {
  name: "AgentInfoManage",
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
          title: "名字(可填写)",
          dataIndex: "agentName",
          slotName: "agentName",
        },
        {
          title: "手机号(可填写)",
          dataIndex: "phone",
          slotName: "phone",
          ellipsis: true,
        },
        // {
        //   title: "密码(可填写)",
        //   dataIndex: "password",
        //   slotName: "password",
        //   ellipsis: true,
        //   render: function({record}){
        //     let {password} = record;
        //     return password;
        //   }
        // },
        {
          title: "账号余额(可填写)",
          dataIndex: "accountBalance",
          slotName: "accountBalance",
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
        total: 15,
        current: 1,
        pageSize: 15,
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
      reqAgentInfo({
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

    function delApply(value) {
      reqDelAgent([value])
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

    function sumbitUpAgentInfo(data) {
      console.log(data);
      reqUpAgentInfo({
        id: data.record.id,
        agentName: data.record.agentName,
        phone: data.record.phone,
        accountBalance: data.record.accountBalance,
        password: data.record.password,
      })
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            NotificationSuccess({
              title: "修改成功",
            });
            initData();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "修改失败",
          });
        });
    }

    function pageChange(num){
      initData(num);
    }


    function nameInputStatusExchange(data) {
      data.record.nameInputStatus = !data.record.nameInputStatus;
    }

    function phoneInputStatusExchange(data) {
      data.record.phoneInputStatus = !data.record.phoneInputStatus;
    }

    function balanceInputStatusExchange(data) {
      data.record.balanceInputStatus = !data.record.balanceInputStatus;
    }

    function passwordInputStatusExchange(data) {
      data.record.passwordInputStatus = !data.record.passwordInputStatus;
    }

    return {
      tableConfig,
      delApply,
      sumbitUpAgentInfo,
      pageChange,
      nameInputStatusExchange,
      phoneInputStatusExchange,
      balanceInputStatusExchange,
      passwordInputStatusExchange,
    };
  },
};
</script>

<style>
</style>