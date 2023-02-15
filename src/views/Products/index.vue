<template>
  <BSSubHeader icon="apps" iconClass="material-symbols-sharp" title="产品">
    <template #other>
      <div class="btns">
        <a-button-group>
          <a-popconfirm content="确认购买?" position="bottom" @ok="sumbit">
            <a-button type="primary">
              <template #icon>
                <span>{{ shop.select.length }}</span>
              </template>
              购买
            </a-button>
          </a-popconfirm>
          <a-popconfirm content="确认重置?" position="bottom" @ok="reset">
            <a-button type="outline"> 重置 </a-button>
          </a-popconfirm>
        </a-button-group>
      </div>
      <div class="tags">
        <a-space>
          <a-tag
            color="#ff5722"
            size="large"
            v-for="item in shop.select"
            :key="item.id"
          >
            <template #icon> <icon-plus style="color: white" /> </template>
            {{ item.productName }}
          </a-tag>
        </a-space>
      </div>
    </template>
  </BSSubHeader>
  <BSCard>
    <template #content>
      <div class="topic">
        <div
          class="box"
          v-for="item in products.records"
          :key="item.id"
          @click="showDetail(item.id)"
        >
          <a-card class="card-1" hoverable>
            <template #title>
              <span class="topic-title">{{ item.productName }}</span>
            </template>
            <template #actions>
              <span
                v-if="!selectExisted(item.id)"
                class="material-symbols-sharp"
                @click.stop="addShop(item)"
                >add</span
              >
              <span
                v-if="selectExisted(item.id)"
                class="material-symbols-sharp"
                @click.stop="removeShop(item.id)"
                >delete</span
              >
            </template>
            <template #extra>
              <div
                v-if="selectExisted(item.id)"
                style="
                  width: 20px;
                  height: 20px;
                  background-color: #2baf2b;
                  border-radius: 50%;
                "
              ></div>
            </template>
            <a-card-meta>
              <template #title>
                <div></div>
              </template>
              <template #description>
                <span class="des">
                  {{ item.introduction }}
                </span>
              </template>
              <template #avatar>
                年费:{{ item.annualFee }}￥ 永久:{{ item.perpetualFee }}
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
    </template>
  </BSCard>
  <BSCard>
    <template #content>
      <div class="page">
        <div>
          <a-pagination
            :total="pageConfig.total"
            v-model:current="pageConfig.current"
            v-model:page-size="pageConfig.pageSize"
            :show-page-size="false"
            @change="pageChange"
          />
        </div>
      </div>
    </template>
  </BSCard>
  <div class="drawer">
    <a-drawer
      :width="700"
      :visible="drawerConfig.visible"
      @ok="drawerOk"
      @cancel="drawerCancel"
      placement="right"
      :footer="false"
      unmountOnClose
    >
      <template #title>
        <span>{{ drawerConfig.title }}</span>
      </template>
      <div>
        <a-descriptions :data="drawerConfig.data" :column="1" size="large">
          <a-descriptions-item label="产品名">
            {{ drawerConfig.data.productName }}
          </a-descriptions-item>
          <a-descriptions-item label="年费">
            {{ drawerConfig.data.annualFee }}
          </a-descriptions-item>
          <a-descriptions-item label="永久费用">
            {{ drawerConfig.data.perpetualFee }}
          </a-descriptions-item>
          <a-descriptions-item label="详情">
            {{ drawerConfig.data.introduction }}
          </a-descriptions-item>
          <a-descriptions-item label="是否分配">
            {{ drawerConfig.data.ifAllocation ? "是" : "否" }}
          </a-descriptions-item>
          <a-descriptions-item label="上架时间">
            {{ getFormatTime(drawerConfig.data.createTime) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-drawer>
  </div>
  <a-modal
    :visible="payModalConfig.visible"
    ok-text="确认提交"
    cancel-text="取消提交"
    :ok-loading="payModalConfig.loading"
    @ok="payModalOk"
    @cancel="payModalCancel"
    @close="payModalClose"
  >
    <template #title> 支付 </template>
    <div class="pay-wrapper">
      <a-radio-group v-model="payModalConfig.selectPay" type="button">
        <a-radio value="1">年费</a-radio>
        <a-radio value="2">买断</a-radio>
      </a-radio-group>
      <!-- <img style="width: 200px" src="./img/qrcode.png" alt="pagpic" /> -->
      <!-- <span>支付金额: {{ getPayMoney() }}</span> -->
    </div>
  </a-modal>
</template>

<script>
import store from "@/store/index";
import { computed, reactive, ref } from "@vue/runtime-core";
import { timestampFormat } from "@/utils/timeUtil";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { MessageWarning } from "@/common/Message";
import { reqOrder } from "@/api";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
export default {
  name: "Products",
  components: {
    IconPlus,
  },
  setup() {
    const productstate = store.state.productstore;
    const userstate = store.state.userstore;

    const pageConfig = reactive({
      total: 20,
      current: 1,
      pageSize: 20,
      defaultCurrent: 1,
    });

    const drawerConfig = reactive({
      visible: false,
      title: "产品详情",
      data: {},
    });

    const shop = reactive({
      select: [],
    });

    const products = computed(() => {
      return productstate.products;
    });

    const payModalConfig = reactive({
      visible: false,
      selectPay: 0,
      loading: false,
    });

    function getFormatTime(ts) {
      return timestampFormat(ts);
    }

    function drawerOk() {
      drawerConfig.visible = false;
    }

    function drawerCancel() {
      drawerConfig.visible = false;
    }

    function showDetail(id) {
      drawerConfig.visible = true;
      //  获取商品详情
      let res = products.value.records.find((pro) => {
        if (pro.id == id) {
          return true;
        }
      });
      drawerConfig.data = res;
      console.log(drawerConfig);
    }

    function addShop(pro) {
      if (shop.select.length == 1) {
        MessageWarning({
          content: "请单个购买",
        });
        return;
      }

      shop.select.push(pro);
    }

    function removeShop(id) {
      shop.select.forEach((pro, index) => {
        if (id == pro.id) {
          shop.select.splice(index, 1);
        }
      });
    }

    function selectExisted(id) {
      let res = shop.select.find((pro) => {
        if (pro.id == id) return true;
      });
      return res ? true : false;
    }

    function reset() {
      shop.select = [];
    }

    function sumbit() {
      if (!shop.select.length) {
        MessageWarning({
          content: "请先选择商品，再购买",
        });
        return;
      }

      payModalConfig.visible = true;
    }

    function payModalOk() {
      if (payModalConfig.selectPay == 0) {
        MessageWarning({
          content: "请选择购买期限",
        });
        return;
      }

      payModalConfig.loading = true;
      // 发送订单请求
      let payPromise = [];
      shop.select.forEach((pro) => {
        payPromise.push(
          reqOrder({
            customerId: userstate.userinfo.id,
            permission: payModalConfig.selectPay,
            productId: pro.id,
          })
        );
      });
      Promise.all(payPromise)
        .then((res) => {
          for (let r of res) {
            if (r.code != 1) {
              return Promise.reject();
            }
          }
          NotificationSuccess({
            title: "购买成功",
          });
          shop.select = [];
        })
        .catch((err) => {
          NotificationError({
            title: "购买失败",
          });
        });
      payModalConfig.loading = false;
      payModalConfig.selectPay = 0;
      payModalConfig.visible = false;
    }

    function payModalCancel() {
      payModalConfig.visible = false;
    }

    function payModalClose() {
      payModalConfig.visible = false;
    }

    function getPayMoney() {
      let money = 0;
      // 判断购买方式
      if (payModalConfig.selectPay == 1) {
        shop.select.forEach((pro) => {
          money += pro.annualFee;
        });
      } else if (payModalConfig.selectPay == 2) {
        shop.select.forEach((pro) => {
          money += pro.perpetualFee;
        });
      } else {
        money = "请选择购买期限";
      }
      return money;
    }

    pageChange(pageConfig.defaultCurrent);
    function pageChange(num) {
      console.log(num);
      // 获取所有产品
      store
        .dispatch("productstore/getProducts", {
          pageNo: num,
          pageSize: pageConfig.pageSize,
        })
        .then((res) => {
          let { total, current, pages } = res;
          pageConfig.total = total;
          pageConfig.current = current;
          pageConfig.defaultCurrent = pages;
        })
        .catch((err) => {
          MessageWarning({
            content: "获取数据失败",
          });
        });
    }

    return {
      pageConfig,
      products,
      drawerConfig,
      shop,
      payModalConfig,
      getFormatTime,
      drawerOk,
      drawerCancel,
      showDetail,
      addShop,
      removeShop,
      selectExisted,
      reset,
      sumbit,
      payModalOk,
      payModalCancel,
      payModalClose,
      getPayMoney,
      pageChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.topic {
  display: flex;
  flex-wrap: wrap;

  & .box {
    padding: 5px;
    width: 300px;
    flex-grow: 1;
    cursor: pointer;
    & .card-1 {
      transition-property: all;

      & .des {
        height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      & .topic-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    & .card-1:hover {
      transform: translateY(-4px);
    }
  }
}

.tags {
  padding: 0 1rem;
}

.page {
  display: flex;
  justify-content: center;
}

.pay-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>