<template>
  <BSSubHeader
    icon="real_estate_agent"
    iconClass="material-symbols-sharp"
    title="成为代理商"
  >
  </BSSubHeader>
  <BSCard>
    <template #content>
      <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
        <a-form-item field="identityCard" label="身份证">
          <a-input
            v-model="form.identityCard"
            placeholder="请输入身份证号..."
          />
        </a-form-item>
        <a-form-item field="post" label="营业执照">
          <a-upload
            v-model:file-list="form.businessLicense"
            :show-upload-button="true"
            :auto-upload="false"
            list-type="picture-card"
            :show-retry-button="false"
            :image-preview="true"
            limit="1"
          />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </template>
  </BSCard>
</template>

<script>
import store from "@/store";
import { reactive } from "@vue/reactivity";
import { reqBeAgent, reqFileUpload } from "@/api";
import { MessageWarning } from '@/common/Message';
import { NotificationError, NotificationSuccess } from '@/common/Notification';
export default {
  name: "BeAgent",
  setup() {
    const form = reactive({
      customerId: "",
      businessLicense: [],
      identityCard: "",
    });
    const userstore = store.state.userstore;

    function handleSubmit() {
      // 校验
      if (form.businessLicense.length && form.identityCard) {
        let formdata = new FormData();
        formdata.append("file", form.businessLicense[0].file);
        reqFileUpload(formdata)
          .then((res) => {
            if(res.code == 1){
              let picUrl = res.data
              return reqBeAgent({
                customerId: userstore.userinfo.id,
                identityCard: form.identityCard,
                businessLicense: picUrl
              })
            }else{
              console.log(res);
              return Promise.reject()
            }
          })
          .then(res => {
            if(res.code == 1){
              NotificationSuccess({
                title: '申请成功'
              })
            }else{
              console.log(res);
              return Promise.reject()
            }
          })
          .catch((err) => {
            NotificationError({
                title: '申请失败'
              })
          });
      }else{
        MessageWarning({
          content: '请将信息补充完整再申请'
        })
      }
    }

    return {
      form,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>