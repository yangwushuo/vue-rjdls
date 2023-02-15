<template>
  <BSSubHeader
    icon="reorder"
    iconClass="material-symbols-sharp"
    title="工单处理"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div>
        <div v-if="allFeedBack.length == 0">
          <a-empty></a-empty>
        </div>
        <div v-else>
          <a-table
            :bordered="tableConfig.bordered"
            :stripe="tableConfig.stripe"
            :table-layout-fixed="tableConfig.tableLayoutFixed"
            :columns="columns"
            :data="allFeedBack"
            :loading="tableConfig.loading"
            :pagination="tableConfig.pagination"
            @pageChange="pageChange"
          >
            <template #status="data">
              <a-tag :color="data.record.status == 2? '#00b42a':'#ff5722'">{{
                data.record.status == 2? '已处理':'未处理'
              }}</a-tag>
            </template>
            <template #processingLevel="data">
              {{
                data.record.processingLevel == 2 ? "管理员处理" : "代理商处理"
              }}
            </template>
            <template #edit="data">
              <div>
                <span style="padding: 0 2px">
                  <a-button
                    type="outline"
                    shape="round"
                    size="mini"
                    @click="processed(data)"
                    >已处理</a-button
                  >
                </span>
                <span style="padding: 0 2px">
                  <a-button
                    type="outline"
                    status="danger"
                    shape="round"
                    size="mini"
                    @click="adminProcessed(data)"
                    >管理员处理</a-button
                  >
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </template>
  </BSCard>
</template>

<script>
import { ref, reactive } from "@vue/reactivity";
import { reqFeedBackManage, reqUpFeedBack, reqUserInfoById } from "@/api";
import { MessageWarning } from "@/common/Message";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError } from "@/common/Notification";
import { watch } from "@vue/runtime-core";
import store from "@/store";
export default {
  name: "FeedbackManage",
  setup() {
    // 获取所有工单
    const tableConfig = reactive({
      bordered: false,
      stripe: false,
      loading: false,
      tableLayoutFixed: false,
      pagination: {
        total: 10,
        current: 1,
        pageSize: 10,
        defaultCurrent: 1,
      },
    });
    const allFeedBack = ref([]);
    const allFeedBackSource = ref([]);
    const columns = [
      {
        title: "Id",
        dataIndex: "id",
      },
      {
        title: "产品名",
        dataIndex: "productName",
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
      },
      {
        title: "反馈信息",
        dataIndex: "feedbackContent",
        tooltip: true,
        ellipsis: true,
      },
      {
        title: "客户",
        dataIndex: "cuName",
      },
      {
        title: "编辑",
        dataIndex: "edit",
        slotName: "edit",
      },
    ];

    // 初始化数据
    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      tableConfig.loading = true;
      reqFeedBackManage({
        agentId: store.state.userstore.userinfo.id,
        pageNo,
        pageSize,
      })
        .then((res) => {
          if (res.code == 1) {
            let { records, total, current, pages } = res.data;
            tableConfig.data = records;
            tableConfig.pagination.total = total;
            tableConfig.pagination.current = current;
            tableConfig.pagination.defaultCurrent = pages;
            allFeedBack.value = records;
            allFeedBackSource.value = JSON.parse(JSON.stringify(records));
            // feedbackRender();
            tableConfig.loading = false;
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          MessageWarning({
            content: "工单获取失败",
          });
          tableConfig.loading = false;
        });
    }

    // 根据id获取用户信息
    async function getUserInfoById(id) {
      let username = "匿名用户";
      let res = await reqUserInfoById({
        id,
      });
      if (res.code == 1) {
        username = res.data.cuName;
      }

      return username;
    }

    function feedbackRender() {
      for (let obj of allFeedBack.value) {
        if (obj.status == 1) {
          obj.status = "未解决";
        } else {
          obj.status = "已解决";
        }

        if (obj.processingLevel == 1) {
          obj.processingLevel = "代理商处理";
        } else {
          obj.processingLevel = "管理员处理";
        }

        if (obj.customerId) {
          getUserInfoById(obj.customerId).then((res) => {
            obj.customerId = res;
          });
          obj.customerId = "---";
        }

        if (obj.createTime) {
          let res = timestampFormat(obj.createTime);
          obj.createTime = res;
        }
      }
    }

    function processed(data) {
      let record = data.record;

      let res = allFeedBackSource.value.find((fb) => {
        if (fb.id == record.id) return true;
      });
      console.log(res);
      if (res.status == 2) return;

      reqUpFeedBack({
        id: record.id,
        status: 2,
        processingLevel: 1,
      })
        .then((res) => {
          if (res.code == 1) {
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

    function adminProcessed(data) {
      let record = data.record;
      reqUpFeedBack({
        id: record.id,
        status: 1,
        processingLevel: 2,
      })
        .then((res) => {
          if (res.code == 1) {
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

    function pageChange(num) {
      initData(num);
    }

    watch(
      () => store.state.userstore.userinfo,
      (nv, ov) => {
        if (nv.id) {
          initData();
        }
      },
      {
        immediate: true,
      }
    );

    function getStatusObj(status) {
      let obj = {
        color: "",
        text: "",
      };
      if (status == 0) {
        obj.text = "未解决";
        obj.color = "#ff5722";
      } else if (status == 2) {
        obj.text = "已解决";
        obj.color = "#00b42a";
      } else {
        obj.text = "已解决";
        obj.color = "#00b42a";
      }
    }
    return {
      tableConfig,
      allFeedBack,
      columns,
      processed,
      adminProcessed,
      pageChange,
      getStatusObj,
    };
  },
};
</script>

<style>
</style>