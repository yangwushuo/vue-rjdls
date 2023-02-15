<template>
  <BSCard>
    <template #content>
      <div class="btns">
        <a-button
          type="primary"
          status="success"
          size="medium"
          shape="round"
          @click="addProduct"
          >添加产品
          <template #icon>
            <div class="btns-icon">
              <icon-plus-circle :size="20" :strokeWidth="3" />
            </div>
          </template>
        </a-button>
      </div>
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
        <template #ifAllocation="data">
          <a-tag :color="getStatusObj(data.record.ifAllocation).color">{{
            getStatusObj(data.record.ifAllocation).text
          }}</a-tag>
        </template>
        <template #productName="data">
          <div>
            <span
              @click="productNameInputStatusExchange(data)"
              v-if="!data.record.productNameInputStatus"
              >{{ data.record.productName }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="productNameInputStatusExchange(data)"
              size="mini"
              v-if="data.record.productNameInputStatus"
              v-model="data.record.productName"
              :placeholder="产品名"
            ></a-input>
            <a-button
              v-if="
                !data.record.productName?.length &&
                !data.record.productNameInputStatus
              "
              size="mini"
              @click="productNameInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #annualFee="data">
          <div>
            <span
              @click="annualFeeInputStatusExchange(data)"
              v-if="!data.record.annualFeeInputStatus"
              >{{ data.record.annualFee }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="annualFeeInputStatusExchange(data)"
              size="mini"
              v-if="data.record.annualFeeInputStatus"
              v-model="data.record.annualFee"
              :placeholder="年费"
            ></a-input>
            <a-button
              v-if="!data.record.annualFee && !data.record.annualFeeInputStatus"
              size="mini"
              @click="annualFeeInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #perpetualFee="data">
          <div>
            <span
              @click="perpetualFeeInputStatusExchange(data)"
              v-if="!data.record.perpetualFeeInputStatus"
              >{{ data.record.perpetualFee }}</span
            >
            <a-input
              style="width: 11rem"
              @blur="perpetualFeeInputStatusExchange(data)"
              size="mini"
              v-if="data.record.perpetualFeeInputStatus"
              v-model="data.record.perpetualFee"
              placeholder="买断费用"
            ></a-input>
            <a-button
              v-if="
                !data.record.perpetualFee &&
                !data.record.perpetualFeeInputStatus
              "
              size="mini"
              @click="perpetualFeeInputStatusExchange(data)"
              >填写</a-button
            >
          </div>
        </template>
        <template #detail="data">
          <a-button size="mini" @click="goDetail(data)" status="" type="dashed"
            >详情操作</a-button
          >
        </template>
        <template #edit="data">
          <a-button-group size="mini">
            <a-popconfirm
              content="确认分配?"
              type="success"
              position="bottom"
              @ok="allocation(data)"
            >
              <a-button type="primary">分配</a-button>
            </a-popconfirm>
            <a-popconfirm
              content="确认修改?"
              type="warning"
              position="bottom"
              @ok="upProduct(data)"
            >
              <a-button type="outline">修改</a-button>
            </a-popconfirm>
            <a-popconfirm
              content="确认删除?"
              type="error"
              position="bottom"
              @ok="delProduct(data)"
            >
              <a-button type="primary">删除</a-button>
            </a-popconfirm>
          </a-button-group>
        </template>
      </a-table>
    </template>
  </BSCard>
  <a-drawer
    :visible="detailDrawerConfig.visible"
    :placement="detailDrawerConfig.placement"
    :title="detailDrawerConfig.title"
    :footer="detailDrawerConfig.footer"
    :width="detailDrawerConfig.width"
    :unmount-on-close="detailDrawerConfig.unmountOnClose"
    :ok-loading="detailDrawerConfig.okLoading"
    @ok="detailDrawerSumbit"
    @cancel="detailDrawerCancel"
    @close="detailDrawerClose"
    ok-text="提交修改"
    cancel-text="取消修改"
  >
    <div style="padding: 1rem 4rem 1rem 1rem">
      <a-form :layout="vertical">
        <a-form-item :label="'产品名:'">
          <span>{{ detailDrawerConfig.productName }}</span>
        </a-form-item>
        <a-form-item label="使用手册下载地址" show-colon help="www.xxxx.com">
          <a-input v-model="detailDrawerConfig.serviceManualLink"></a-input>
        </a-form-item>
        <a-form-item label="软件产品下载地址" show-colon help="www.xxxx.com">
          <a-input v-model="detailDrawerConfig.productLink"></a-input>
        </a-form-item>
        <a-form-item label="软件产品使用地址" show-colon help="www.xxxx.com">
          <a-input v-model="detailDrawerConfig.productUseLink"></a-input>
        </a-form-item>
        <a-form-item label="说明" show-colon>
          <a-textarea
            v-model="detailDrawerConfig.introduction"
            style="height: 300px"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
  <a-drawer
    :visible="addProductDrawerConfig.visible"
    :placement="addProductDrawerConfig.placement"
    :title="addProductDrawerConfig.title"
    :footer="addProductDrawerConfig.footer"
    :width="addProductDrawerConfig.width"
    :unmount-on-close="addProductDrawerConfig.unmountOnClose"
    :ok-loading="addProductDrawerConfig.okLoading"
    @ok="addProductDrawerSumbit"
    @cancel="addProductDrawerCancel"
    @close="addProductDrawerClose"
    ok-text="添加"
    cancel-text="取消"
  >
    <div style="padding: 1rem 4rem 1rem 1rem">
      <a-form :layout="vertical">
        <a-form-item label="产品名" show-colon help="xxx系统">
          <a-input v-model="addProductDrawerConfig.productName"></a-input>
        </a-form-item>
        <a-form-item label="年费" show-colon>
          <a-input-number
            style="width: 7rem"
            v-model="addProductDrawerConfig.annualFee"
            min="0"
            placeholder="金额"
          >
            <template #prefix>
              <span>￥</span>
            </template>
          </a-input-number>
        </a-form-item>
        <a-form-item label="买断费用" show-colon>
          <a-input-number
            style="width: 7rem"
            placeholder="金额"
            v-model="addProductDrawerConfig.perpetualFee"
            min="0"
          >
            <template #prefix>
              <span>￥</span>
            </template>
          </a-input-number>
        </a-form-item>
        <a-form-item label="使用手册下载地址" show-colon help="www.xxxx.com">
          <a-input v-model="addProductDrawerConfig.serviceManualLink"></a-input>
        </a-form-item>
        <a-form-item label="软件产品下载地址" show-colon help="www.xxxx.com">
          <a-input v-model="addProductDrawerConfig.productLink"></a-input>
        </a-form-item>
        <a-form-item label="软件产品使用地址" show-colon help="www.xxxx.com">
          <a-input v-model="addProductDrawerConfig.productUseLink"></a-input>
        </a-form-item>
        <a-form-item label="说明" show-colon>
          <a-textarea
            v-model="addProductDrawerConfig.introduction"
            style="height: 300px"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
  <a-drawer
    :visible="allocationProductDrawerConfig.visible"
    :placement="allocationProductDrawerConfig.placement"
    :title="allocationProductDrawerConfig.title"
    :footer="allocationProductDrawerConfig.footer"
    :width="allocationProductDrawerConfig.width"
    :ok-loading="allocationProductDrawerConfig.okLoading"
    :unmount-on-close="allocationProductDrawerConfig.unmountOnClose"
    @ok="allocationProductDrawerSumbit"
    @cancel="allocationProductDrawerCancel"
    @close="allocationProductDrawerClose"
    ok-text="分配"
    cancel-text="取消"
  >
    <div style="padding: 1rem 4rem 1rem 0">
      <a-form :layout="vertical">
        <a-form-item label="产品名">
          <a-tag size="large" :color="'arcoblue'" bordered
            >{{ allocationProductDrawerConfig.productName }}
            <template #icon>
              <div class="icon-wrapper">
                <span class="material-symbols-sharp" style="font-size: 20px"
                  >apps</span
                >
              </div>
            </template>
          </a-tag>
        </a-form-item>
        <a-form-item label="代理商">
          <a-select
            :style="{ width: '320px' }"
            :placeholder="allocationProductDrawerConfig.selectData.placeholder"
            :options="allocationProductDrawerConfig.selectData.options"
            :loading="allocationProductDrawerConfig.selectData.loading"
            :allow-search="allocationProductDrawerConfig.selectData.allowSearch"
            @change="agentSelectChange"
            @popup-visible-change="popupVisibleChange"
            @dropdown-reach-bottom="getMoreAgent"
          >
          </a-select>
          <a-button v-if="allocationProductDrawerConfig.agentInfo" type="outline" :loading="allocationProductDrawerConfig.delAllocationLoading" @click="delAllocation">删除关联</a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>

<script>
import { reactive } from "@vue/runtime-core";
import {
  reqAddProduct,
  reqAgentAllocationProductByProductId,
  reqAgentInfo,
  reqAgentProductAssociation,
  reqDelAllocation,
  reqDelProduct,
  reqProducts,
  reqUpProduct,
} from "@/api";
import { timestampFormat } from "@/utils/timeUtil";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
import { IconPlus, IconPlusCircle } from "@arco-design/web-vue/es/icon";
import { MessageWarning } from "@/common/Message";
import { isNull } from 'lodash-es';
export default {
  name: "AdminProductManage",
  components: {
    IconPlus,
    IconPlusCircle,
  },
  setup() {
    let tableConfig = reactive({
      columns: [
        {
          title: "Id",
          dataIndex: "id",
        },
        {
          title: "上架时间",
          dataIndex: "createTime",
          ellipsis: true,
          render: function ({ record }) {
            return timestampFormat(record.createTime);
          },
        },
        {
          title: "分配",
          dataIndex: "ifAllocation",
          slotName: "ifAllocation",
        },
        {
          title: "产品名",
          dataIndex: "productName",
          slotName: "productName",
          ellipsis: true,
        },
        {
          title: "￥年费",
          dataIndex: "annualFee",
          slotName: "annualFee",
          ellipsis: true,
        },
        {
          title: "￥买断费用",
          dataIndex: "perpetualFee",
          slotName: "perpetualFee",
          ellipsis: true,
        },
        {
          title: "详情查看",
          dataIndex: "detail",
          slotName: "detail",
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
    let detailDrawerConfig = reactive({
      visible: false,
      placement: "right",
      title: "产品详情",
      footer: true,
      data: null,
      width: 800,
      unmountOnClose: true,
      okLoading: false,
      productName: "",
      serviceManualLink: "",
      productLink: "",
      productUseLink: "",
      introduction: "",
    });

    let addProductDrawerConfig = reactive({
      visible: false,
      placement: "right",
      title: "添加产品",
      footer: true,
      width: 800,
      unmountOnClose: true,
      okLoading: false,
      productName: "",
      annualFee: null,
      perpetualFee: null,
      serviceManualLink: "",
      productLink: "",
      productUseLink: "",
      introduction: "",
    });

    let allocationProductDrawerConfig = reactive({
      visible: false,
      placement: "right",
      title: "分配产品",
      footer: true,
      width: 800,
      unmountOnClose: true,
      okLoading: false,
      delAllocationLoading: false,
      productName: "",
      productId: "",
      agentInfo: "",
      selectData: {
        allowSearch: true,
        selectId: "",
        placeholder: "代理商",
        loading: false,
        options: [],
        pageNo: 1,
        pageSize: 7,
      },
    });

    initData();
    function initData(
      pageNo = tableConfig.pagination.defaultCurrent,
      pageSize = tableConfig.pagination.pageSize
    ) {
      tableConfig.loading = true;
      reqProducts({
        pageNo,
        pageSize,
      }).then((res) => {
        if (res.code == 1) {
          let { records, total, current, pages } = res.data;
          tableConfig.dataSource = records;
          tableConfig.pagination.total = total;
          tableConfig.pagination.current = current;
          tableConfig.data = JSON.parse(JSON.stringify(records));
          tableConfig.loading = false;
        }
      });
    }

    function getStatusObj(ifAllocation) {
      let obj = {
        color: "",
        text: "",
      };
      if (!ifAllocation) {
        obj.text = "未分配";
        obj.color = "#ff5722";
      } else {
        obj.text = "已分配";
        obj.color = "#00b42a";
      }

      return obj;
    }

    function pageChange(num) {
      initData(num);
    }

    function goDetail(data) {
      let {
        productName,
        serviceManualLink,
        productLink,
        productUseLink,
        introduction,
      } = data.record;
      Object.assign(detailDrawerConfig, {
        data: data.record,
        productName,
        serviceManualLink,
        productLink,
        productUseLink,
        introduction,
        visible: true,
      });
    }

    function upProduct(data) {
      let { id, annualFee, perpetualFee, productName } = data.record;
      reqUpProduct({
        id,
        annualFee,
        perpetualFee,
        productName,
      })
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "修改成功",
            });
            initData(tableConfig.pagination.current);
          }
        })
        .catch((err) => {
          NotificationError({
            title: "修改失败",
          });
        });
    }

    function detailDrawerSumbit() {
      detailDrawerConfig.okLoading = true;
      let { serviceManualLink, productLink, productUseLink, introduction } =
        detailDrawerConfig;
      reqUpProduct({
        id: detailDrawerConfig.data.id,
        introduction,
        serviceManualLink,
        productLink,
        productUseLink,
      })
        .then((res) => {
          if (res.code == 1) {
            detailDrawerConfig.okLoading = false;
            detailDrawerConfig.visible = false;
            NotificationSuccess({
              title: "修改成功",
            });
            initData(tableConfig.pagination.current);
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

    function detailDrawerClose() {
      Object.assign(detailDrawerConfig, {
        visible: false,
        data: null,
        productName: "",
        serviceManualLink: "",
        productLink: "",
        productUseLink: "",
        introduction: "",
      });
    }

    function detailDrawerCancel() {
      Object.assign(detailDrawerConfig, {
        visible: false,
        data: null,
        productName: "",
        serviceManualLink: "",
        productLink: "",
        productUseLink: "",
        introduction: "",
      });
    }

    function addProduct() {
      addProductDrawerConfig.visible = true;
    }

    function addProductDrawerSumbit() {
      let {
        productName,
        annualFee,
        perpetualFee,
        serviceManualLink,
        productLink,
        productUseLink,
        introduction,
      } = addProductDrawerConfig;

      if(!productName){
        MessageWarning({
          content: '至少给个名字'
        })
        return ;
      }

      addProductDrawerConfig.okLoading = true;
      reqAddProduct({
        productName,
        annualFee,
        perpetualFee,
        serviceManualLink,
        productLink,
        productUseLink,
        introduction,
      })
        .then((res) => {
          if (res.code == 1) {
            addProductDrawerConfig.okLoading = false;
            addProductDrawerConfig.visible = false;
            NotificationSuccess({
              title: "添加成功",
            });
            initData(tableConfig.pagination.current);
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "添加失败",
          });
        });
    }

    function addProductDrawerCancel() {
      Object.assign(addProductDrawerConfig, {
        visible: false,
        productName: "",
        annualFee: null,
        perpetualFee: null,
        serviceManualLink: "",
        productLink: "",
        productUseLink: "",
        introduction: "",
      });
    }

    function addProductDrawerClose() {
      Object.assign(addProductDrawerConfig, {
        visible: false,
        productName: "",
        annualFee: null,
        perpetualFee: null,
        serviceManualLink: "",
        productLink: "",
        productUseLink: "",
        introduction: "",
      });
    }

    function allocation(data) {
      let { productName, id } = data.record;
      allocationProductDrawerConfig.visible = true;
      Object.assign(allocationProductDrawerConfig, {
        productName,
        productId: id,
        visible: true,
      });
      console.log(id);
      reqAgentAllocationProductByProductId({
        id
      }).then(res => {
        console.log(res);
        if(res.code == 1 && !isNull(res.data)){
          allocationProductDrawerConfig.agentInfo = res.data;
          allocationProductDrawerConfig.selectData.placeholder = res.data.agentName || "";
        }else{
          return Promise.reject();
        }
      }).catch(err => {
        
      })
    }

    function agentSelectChange(value) {
      allocationProductDrawerConfig.selectData.selectId = value;
    }

    function popupVisibleChange(value) {
      if (value) {
        allocationProductDrawerConfig.selectData.loading = true;
        let { pageNo, pageSize } = allocationProductDrawerConfig.selectData;
        reqAgentInfo({
          pageNo,
          pageSize,
        })
          .then((res) => {
            if (res.code == 1) {
              let { records } = res.data;
              if (records.length) {
                allocationProductDrawerConfig.selectData.options =
                  agentOptionCheck(records);
                allocationProductDrawerConfig.selectData.loading = false;
              }
            }
          })
          .catch((err) => {});
      } else {
        Object.assign(allocationProductDrawerConfig.selectData, {
          pageNo: 1,
          pageSize: 7,
        });
      }
    }

    function getMoreAgent() {
      let { pageNo, pageSize } = allocationProductDrawerConfig.selectData;
      reqAgentInfo({
        pageNo: ++pageNo,
        pageSize,
      })
        .then((res) => {
          if (res.code == 1) {
            let { records } = res.data;
            if (records.length) {
              allocationProductDrawerConfig.selectData.options.push(
                ...agentOptionCheck(records)
              );
              allocationProductDrawerConfig.selectData.pageNo++;
            }
          }
        })
        .catch((err) => {});
    }

    function agentOptionCheck(sourceData) {
      if (Array.isArray(sourceData)) {
        let res = sourceData.map((item) => {
          return {
            value: item.id,
            label: item.agentName || "匿名",
          };
        });
        console.log(res);
        return res;
      }
    }

    function allocationProductDrawerSumbit() {
      let { selectId } = allocationProductDrawerConfig.selectData;
      if (!selectId) {
        MessageWarning({
          content: "请选择代理商",
        });
        return;
      }

      allocationProductDrawerConfig.okLoading = true;
      // console.log({
      //   agentId: selectId,
      //   productIds: [allocationProductDrawerConfig.productId],
      // });
      reqAgentProductAssociation({
        agentId: selectId,
        productIds: [allocationProductDrawerConfig.productId],
      })
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            NotificationSuccess({
              title: "分配成功",
            });
            allocationProductDrawerConfig.okLoading = false;
            allocationProductDrawerConfig.visible = false;
            allocationProductDrawerConfig.selectData.selectId = "";
            initData(tableConfig.pagination.current)
          } else {
            return Promise.reject();
          }
        })
        .catch((err) => {
          NotificationError({
            title: "分配失败",
          });
          allocationProductDrawerConfig.okLoading = false;
          allocationProductDrawerConfig.visible = false;
          allocationProductDrawerConfig.selectData.selectId = "";
        });
    }

    function allocationProductDrawerCancel() {
      Object.assign(allocationProductDrawerConfig, {
        agentInfo: null,
        productId: "",
        productName: "",
        visible: false
      });
      Object.assign(allocationProductDrawerConfig.selectData, {
        selectId: "",
        placeholder: "代理商",
        options: [],
        pageNo: 1,
      });
    }

    function allocationProductDrawerClose() {
      Object.assign(allocationProductDrawerConfig, {
        agentInfo: null,
        productId: "",
        productName: "",
        visible: false
      });
      Object.assign(allocationProductDrawerConfig.selectData, {
        selectId: "",
        options: [],
        placeholder: "代理商",
        pageNo: 1,
      });
    }

    function delAllocation(){
      // 删除代理关系
      reqDelAllocation({
        id: allocationProductDrawerConfig.productId
      }).then(res => {
        if(res.code == 1){
          
          NotificationSuccess({
            title: '取消分配成功'
          })
          allocationProductDrawerConfig.visible = false;
          initData(tableConfig.pagination.current);
        }else{
          return Promise.reject();
        }
      }).catch(err => {
        NotificationError({
          title: '取消分配失败'
        })
        allocationProductDrawerConfig.visible = false;
      })
    }

    function delProduct(data) {
      reqDelProduct([data.record.id])
        .then((res) => {
          if (res.code == 1) {
            NotificationSuccess({
              title: "删除成功",
            });
            initData(tableConfig.pagination.current);
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

    function productNameInputStatusExchange(data) {
      data.record.productNameInputStatus = !data.record.productNameInputStatus;
    }

    function annualFeeInputStatusExchange(data) {
      data.record.annualFeeInputStatus = !data.record.annualFeeInputStatus;
    }

    function perpetualFeeInputStatusExchange(data) {
      data.record.perpetualFeeInputStatus =
        !data.record.perpetualFeeInputStatus;
    }

    return {
      tableConfig,
      detailDrawerConfig,
      addProductDrawerConfig,
      allocationProductDrawerConfig,
      getStatusObj,
      pageChange,
      goDetail,
      upProduct,
      detailDrawerSumbit,
      detailDrawerClose,
      detailDrawerCancel,
      addProduct,
      addProductDrawerSumbit,
      addProductDrawerCancel,
      addProductDrawerClose,
      allocation,
      agentSelectChange,
      popupVisibleChange,
      getMoreAgent,
      allocationProductDrawerSumbit,
      allocationProductDrawerClose,
      allocationProductDrawerCancel,
      productNameInputStatusExchange,
      annualFeeInputStatusExchange,
      perpetualFeeInputStatusExchange,
      delProduct,
      delAllocation
    };
  },
};
</script>

<style lang="scss" scoped>
.btns {
  padding: 0 1rem 1rem 0;

  & .btns-icon {
    display: flex;
    justify-content: center;
    align-content: center;
  }
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>