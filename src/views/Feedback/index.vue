<template>
  <BSSubHeader
    icon="contact_mail"
    iconClass="material-symbols-sharp"
    title="反馈"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
        <a-form-item field="identityCard" label="已购买产品">
          <a-radio-group @change="selectPro">
            <template v-for="item in customerProducts" :key="item.productId">
              <div style="padding-bottom: 10px">
                <a-radio :value="item.productId">
                  <template #radio="{ checked }">
                    <a-space
                      align="start"
                      class="custom-radio-card"
                      :class="{ 'custom-radio-card-checked': checked }"
                    >
                      <div className="custom-radio-card-mask">
                        <div className="custom-radio-card-mask-dot" />
                      </div>
                      <div>
                        <div className="custom-radio-card-title">
                          {{ item.productName }}
                        </div>
                      </div>
                    </a-space>
                  </template>
                </a-radio>
              </div>
            </template>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="content" label="反馈信息">
          <a-textarea
            v-model="form.feedbackContent"
            placeholder="反馈信息"
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button
            :loading="formLoading"
            show-word-limit
            html-type="submit"
            type="primary"
            >提交</a-button
          >
        </a-form-item>
      </a-form>
    </template>
  </BSCard>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import store from "@/store";
import { reqFeedBack } from "@/api";
import { NotificationError, NotificationSuccess } from "@/common/Notification";
export default {
  name: "FeedBack",
  setup() {
    const form = reactive({
      productId: "",
      feedbackContent: "",
    });
    let formLoading = ref(false);

    const productstore = store.state.productstore;
    const userstore = store.state.userstore;

    watch(
      () => userstore.userinfo.id,
      (nv, ov) => {
        if (nv) {
          console.log(nv);
          store.dispatch("productstore/getCostumerProducts", {
            customerId: nv,
            pageNo: 1,
            pageSize: 999,
          });
        }
      },
      {
        immediate: true,
      }
    );

    const customerProducts = computed(() => {
      return productstore.costumerProducts.records;
    });

    function handleSubmit() {
      formLoading.value = true;
      reqFeedBack({
        ...form,
        customerId: userstore.userinfo.id,
      })
        .then((res) => {
          formLoading.value = false;
          if (res.code == 1) {
            NotificationSuccess({
              title: "反馈成功",
            });
          } else {
            NotificationError({
              title: "反馈失败",
            });
          }
        })
        .catch((err) => {
          formLoading.value = false;
          NotificationError({
            title: "反馈失败",
          });
        });

      form.productId = ""
      form.feedbackContent = ""
    }

    function selectPro(e) {
      form.productId = e;
    }

    return {
      form,
      formLoading,
      customerProducts,
      selectPro,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-radio-card {
  padding: 10px 16px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}

.custom-radio-card-mask {
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked .custom-radio-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>