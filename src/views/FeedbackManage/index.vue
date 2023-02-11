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
            :columns="columns"
            :data="allFeedBack"
            :loading="tableConfig.loading"
          >
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
export default {
  name: "FeedbackManage",
  setup() {
    // 获取所有工单
    const tableConfig = reactive({
      bordered: false,
      stripe: false,
      loading: false,
    });
    const allFeedBack = ref([]);
    const allFeedBackSource = ref([]);
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
        title: "状态",
        dataIndex: "status",
      },
      {
        title: "处理级别",
        dataIndex: "processingLevel",
      },
      {
        title: "反馈信息",
        dataIndex: "feedbackContent",
      },
      {
        title: "客户",
        dataIndex: "customerId",
      },
      {
        title: "编辑",
        dataIndex: "edit",
        slotName: "edit",
      },
    ];

    // 初始化数据
    initData();

    function initData() {
      tableConfig.loading = true;
      reqFeedBackManage({})
        .then((res) => {
          if (res.code == 1) {
            allFeedBack.value = res.data.records;
            allFeedBackSource.value = JSON.parse(JSON.stringify(res.data.records));
            feedbackRender();
          } else {
            return Promise.reject();
          }
          tableConfig.loading = false;
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
          obj.customerId = '---'
        }

        if (obj.createTime) {
          let res = timestampFormat(obj.createTime);
          obj.createTime = res;
        }
      }
    }

    function processed(data) {
      let record = data.record;

      let res = allFeedBackSource.value.find( fb => {
        if(fb.id == record.id) return true;
      })
      console.log(res);
      if(res.status == 2) return 

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

    return {
      tableConfig,
      allFeedBack,
      columns,
      processed,
      adminProcessed,
    };
  },
};
</script>

<style>
</style>