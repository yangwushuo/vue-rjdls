<template>
  <Vue3Marquee
    style="overflow: hidden; padding-bottom: 1rem"
    :duration="12"
    :pauseOnHover="true"
    v-if="userBalanceWarning && closeMarqueeStatus"
  >
    <span class="marquee-content">
      <span class="material-symbols-sharp marquee-icon">money_off </span>
      <span class="marquee-text">您的余额不足，请充值</span>
    </span>
    <icon-close-circle style="color:#9f9fa3;padding:0 5px" :size="23" @click="closeMarquee"/>
  </Vue3Marquee>
  <BSSubHeader
    icon="currency_exchange"
    iconClass="material-symbols-sharp"
    title="充值与退款"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div>
        <div>
          <a-list size="large" :bordered="false" :split="true">
            <a-list-item>
              <ListItem icon="account_balance_wallet" title="余额">
                <template #content>
                  <div class="balance">
                    <span style="padding: 0 3px">
                      <a-statistic
                        :animation="true"
                        :value="userinfo.accountBalance"
                        :animation-duration="300"
                        precision="1"
                        :value-from="0"
                        show-group-separator
                      >
                        <template #prefix>
                          <span style="font-size: 24px">￥</span>
                        </template>
                      </a-statistic>
                    </span>
                    <span>
                      <span style="padding: 0 3px">
                        <a-button
                          type="primary"
                          size="small"
                          status="success"
                          shape="round"
                          @click="sumbitPay"
                          >充值</a-button
                        >
                      </span>
                      <span style="padding: 0 3px">
                        <a-button
                          type="outline"
                          size="small"
                          status="success"
                          shape="round"
                          @click="checkPayHistory"
                          >{{
                            payConfig.open
                              ? payConfig.openText
                              : payConfig.closeText
                          }}

                          <template #icon>
                            <icon-down v-if="!payConfig.open" />
                            <icon-up v-else />
                          </template>
                        </a-button>
                      </span>
                    </span>
                    <a-modal
                      :visible="payModalConfig.visible"
                      ok-text="确认支付"
                      cancel-text="取消支付"
                      :ok-loading="payModalConfig.loading"
                      @ok="payModalOk"
                      @cancel="payModalCancel"
                      @close="payModalClose"
                    >
                      <template #title> 充值 </template>
                      <div class="pay-wrapper">
                        <a-radio-group
                          v-model="payModalConfig.selectPay"
                          type="button"
                        >
                          <a-radio value="1000">￥1000</a-radio>
                          <a-radio value="2000">￥2000</a-radio>
                          <a-radio value="3000">￥3000</a-radio>
                          <a-input-number
                            style="width: 7rem"
                            placeholder="金额"
                            min="0"
                            v-model:modelValue="payModalConfig.selectPay"
                          >
                            <template #prefix> ￥ </template>
                          </a-input-number>
                        </a-radio-group>
                        <img
                          style="width: 200px"
                          src="./img/qrcode.png"
                          alt="paypic"
                        />
                      </div>
                    </a-modal>
                  </div>
                </template>
                <template #other v-if="payConfig.open">
                  <a-table
                    :columns="payConfig.payHistoryTableColumns"
                    :data="payConfig.payHistoryTableData"
                    :pagination="false"
                    size="small"
                    :bordered="false"
                    :table-layout-fixed="true"
                    :loading="payConfig.payTableLoading"
                    :scroll="{y:200}"

                  >
                  <template #empty>
                      
                    </template>
                  </a-table>
                </template>
              </ListItem>
            </a-list-item>
            <a-list-item>
              <ListItem icon="approval_delegation" title="申请退款">
                <template #content>
                  <div>
                    <span>
                      <span style="padding: 0 3px">
                        <a-button
                          type="primary"
                          size="small"
                          status="danger"
                          shape="round"
                          @click="sumbitRefund"
                          >退款</a-button
                        >
                      </span>
                      <span style="padding: 0 3px">
                        <a-button
                          type="outline"
                          size="small"
                          status="danger"
                          shape="round"
                          @click="checkRefundHistory"
                          >{{
                            refundConfig.open
                              ? refundConfig.openText
                              : refundConfig.closeText
                          }}

                          <template #icon>
                            <icon-down v-if="!refundConfig.open" />
                            <icon-up v-else />
                          </template>
                        </a-button>
                      </span>
                    </span>
                    <a-modal
                      :visible="refundModalConfig.visible"
                      ok-text="确认退款"
                      cancel-text="取消退款"
                      :ok-loading="refundModalConfig.loading"
                      @ok="refundModalOk"
                      @cancel="refundModalCancel"
                      @close="refundModalClose"
                    >
                      <template #title> 退款 </template>
                      <div class="refund-wrapper">
                        <div>
                          <a-radio-group
                            v-model="refundModalConfig.selectPay"
                            type="button"
                          >
                            <a-radio value="1000">￥1000</a-radio>
                            <a-radio value="2000">￥2000</a-radio>
                            <a-radio value="3000">￥3000</a-radio>
                            <a-input-number
                              style="width: 7rem"
                              placeholder="金额"
                              min="0"
                              v-model:modelValue="refundModalConfig.selectPay"
                            >
                              <template #prefix> ￥ </template>
                            </a-input-number>
                          </a-radio-group>
                        </div>
                        <div>
                          <a-textarea
                            v-model:modelValue="refundModalConfig.content"
                            style="width: 300px"
                            placeholder="原因"
                            :auto-size="true"
                            allow-clear
                          />
                        </div>
                      </div>
                    </a-modal>
                  </div>
                </template>
                <template #other v-if="refundConfig.open">
                  <a-table
                    :columns="refundConfig.refundHistoryTableColumns"
                    :data="refundConfig.refundHistoryTableData"
                    :pagination="false"
                    size="small"
                    :bordered="false"
                    :table-layout-fixed="true"
                    :loading="refundConfig.refundTableLoading"
                    :scroll="{y:200}"
                  >
                    <template #status="data">
                      <a-tag
                        :color="data.record.status == 0 ? '#ff5722' : '#00b42a'"
                        >{{
                          data.record.status == 0 ? "审核中" : "已通过"
                        }}</a-tag
                      >
                    </template>
                    <template #empty>

                    </template>
                  </a-table>
                </template>
              </ListItem>
            </a-list-item>
          </a-list>
        </div>
      </div>
    </template>
  </BSCard>
 </template>

<script>
import ListItem from "@/components/ListItem";
import { reactive, ref } from "@vue/reactivity";
import { MessageWarning } from "@/common/Message";
import store from "@/store";
import {
  reqAgentInfoById,
  reqAgentPayHistory,
  reqAgentRefund,
  reqAgentRefundHistory,
  reqBalanceRecharge,
} from "@/api";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
import { watch } from "@vue/runtime-core";
import {
  IconDown,
  IconUp,
  IconCloseCircle,
} from "@arco-design/web-vue/es/icon";
import { timestampFormat } from "@/utils/timeUtil";
import { Vue3Marquee } from "vue3-marquee";
import "vue3-marquee/dist/style.css";
export default {
  name: "RechargeRefund",
  components: {
    ListItem,
    IconDown,
    IconUp,
    IconCloseCircle,
    Vue3Marquee,
  },
  setup() {
    const payConfig = reactive({
      open: false,
      openText: "充值收起",
      closeText: "充值查看",
      payHistory: [],
      payHistoryTableData: [],
      payTableLoading: false,
      payHistoryTableColumns: [
        {
          title: "充值时间",
          dataIndex: "createTime",
          ellipsis: true,
        },
        {
          title: "￥金额",
          dataIndex: "money",
          ellipsis: true,
        },
      ],
    });
    const refundConfig = reactive({
      open: false,
      openText: "退款收起",
      closeText: "退款查看",
      refundHistory: [],
      refundHistoryTableData: [],
      refundTableLoading: false,
      refundHistoryTableColumns: [
        {
          title: "申请时间",
          dataIndex: "createTime",
          ellipsis: true,
        },
        {
          title: "状态",
          dataIndex: "status",
          slotName: "status",
          ellipsis: true,
        },
        {
          title: "￥金额",
          dataIndex: "refundMoney",
          ellipsis: true,
        },
        {
          title: "说明",
          dataIndex: "refundReason",
          ellipsis: true,
        },
      ],
    });
    const payModalConfig = reactive({
      visible: false,
      loading: false,
      selectPay: 0,
    });
    const refundModalConfig = reactive({
      visible: false,
      loading: false,
      selectPay: 0,
      content: "",
    });
    const userstore = store.state.userstore;
    let userinfo = ref({
      accountBalance: 0,
    });
    let userBalanceWarning = ref(false);
    let closeMarqueeStatus = ref(true);

    initData();

    function closeMarquee(){
      closeMarqueeStatus.value = false
    }

    function sumbitPay() {
      payModalConfig.visible = true;
    }

    function sumbitRefund() {
      refundModalConfig.visible = true;
    }

    function payModalOk() {
      payModalConfig.loading = true;

      // 校验
      console.log("断点1");
      if (!payModalConfig.selectPay) {
        console.log("断点2");
        MessageWarning({
          content: "请输入金额",
        });
        payModalConfig.loading = false;
        return;
      }

      reqBalanceRecharge({
        agentId: userstore.userinfo.id,
        money: parseFloat(payModalConfig.selectPay),
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "充值成功",
            });
            initData();
            getPayHistory();
            store.dispatch("userstore/getUserInfo");
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "充值失败",
          });
        });

      payModalConfig.loading = false;
      payModalConfig.visible = false;
    }

    function payModalCancel() {
      payModalConfig.visible = false;
      payModalConfig.loading = false;
      payModalConfig.selectPay = 0;
    }

    function payModalClose() {
      payModalConfig.visible = false;
      payModalConfig.loading = false;
      payModalConfig.selectPay = 0;
    }

    function refundModalOk() {
      refundModalConfig.loading = true;
      // 校验
      if (!refundModalConfig.selectPay || !refundModalConfig.content) {
        MessageWarning({
          content: "请补充完成",
        });
        refundModalConfig.loading = false;
        return;
      }

      reqAgentRefund({
        agentId: userstore.userinfo.id,
        refundReason: refundModalConfig.content,
        refundMoney: refundModalConfig.selectPay,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "申请退款成功",
            });
            getRefundHistory();
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "申请退款失败",
          });
        });

      refundModalConfig.loading = false;
      refundModalConfig.visible = false;
    }

    function refundModalCancel() {
      refundModalConfig.visible = false;
      refundModalConfig.loading = false;
      refundModalConfig.selectPay = 0;
      refundModalConfig.content = 0;
    }

    function refundModalClose() {
      refundModalConfig.visible = false;
      refundModalConfig.loading = false;
      refundModalConfig.selectPay = 0;
      refundModalConfig.content = 0;
    }

    function initData() {
      console.log("初始化数据");
      reqAgentInfoById({
        id: userstore.userinfo.id,
      }).then((res) => {
        console.log(userinfo);
        if (res.code == 1) {
          userinfo.value = res.data;
        }
      });
    }

    function checkPayHistory() {
      payConfig.open = !payConfig.open;
      getPayHistory();
    }

    function checkRefundHistory() {
      refundConfig.open = !refundConfig.open;
      getRefundHistory();
    }

    function getPayHistory() {
      payConfig.payHistoryTableData = [];
      payConfig.payTableLoading = true;
      if (payConfig.open) {
        reqAgentPayHistory({
          agentId: userstore.userinfo.id,
        })
          .then((res) => {
            if (res.code == 1) {
              payConfig.payHistoryTableData = res.data.records;
              formatHistory(payConfig.payHistoryTableData);
              payConfig.payTableLoading = false;
            }
          })
          .catch((err) => {});
      }
    }

    function getRefundHistory() {
      refundConfig.refundTableLoading = true;
      refundConfig.refundHistoryTableData = [];
      if (refundConfig.open) {
        reqAgentRefundHistory({
          agentId: userstore.userinfo.id,
        })
          .then((res) => {
            console.log(Date.now());
            if (res.code == 1) {
              refundConfig.refundHistoryTableData = res.data.records;
              formatHistory(refundConfig.refundHistoryTableData);
              refundConfig.refundTableLoading = false;
            }
          })
          .catch((err) => {});
      }
    }

    function formatHistory(data) {
      data.forEach((item) => {
        item.createTime = getTimeFormat(item.createTime);
      });
    }

    function getTimeFormat(ts) {
      return timestampFormat(ts);
    }

    watch(
      () => userstore.userinfo,
      (nv, ov) => {
        initData();
        userBalanceWarning.value = nv.ifWarning;
      },
      {
        immediate: true,
        deep: true,
      }
    );

    return {
      payConfig,
      refundConfig,
      payModalConfig,
      refundModalConfig,
      userinfo,
      userBalanceWarning,
      closeMarqueeStatus,
      closeMarquee,
      sumbitPay,
      sumbitRefund,
      payModalOk,
      payModalCancel,
      payModalClose,
      refundModalOk,
      refundModalCancel,
      refundModalClose,
      checkPayHistory,
      checkRefundHistory,
      getTimeFormat,
    };
  },
};
</script>

<style lang="scss" scoped>
.balance {
  display: flex;
  align-items: center;
}

.pay-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.refund-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.refund-wrapper > div {
  padding: 10px 0;
}

.marquee-content {
  display: flex;
  align-items: center;
  color: #ed1b2e;

  & .marquee-icon {
    font-size: 20px;
  }

  & .marquee-text {
    font-size: 20px;
  }
}
</style>