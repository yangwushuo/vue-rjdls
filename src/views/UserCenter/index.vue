<template>
  <div class="userc-wrapper">
    <BSSubHeader
      icon="person"
      iconClass="material-symbols-sharp"
      title="用户中心"
    >
    </BSSubHeader>
    <BSCard>
      <template #content>
        <div class="info-show">
          <div class="portrait">
            <el-avatar :size="120" :src="userinfo.avatar" />
            <div class="portrait-btns">
              <a-upload
                v-model:file-list="avatarFileList"
                :auto-upload="false"
                limit="1"
                @change="avatarChange"
                :multiple="false"
                :show-file-list="false"
                :show-upload-button="true"
              >
                <template #upload-button>
                  <a-button v-if="userinfo.role != 3" type="primary" shape="round" size="small"
                    >上传头像</a-button
                  >
                </template>
              </a-upload>
            </div>
          </div>
          <div class="info">
            <a-descriptions
              style="margin-top: 20px"
              :data="userInfoDescriptions"
              :size="medium"
              title="用户信息"
              :column="1"
            >
              <template #value="item">
                <span>{{ item.value }}</span>
                <a-button
                  style="margin: 0 4px"
                  v-if="item.data.acceptInput == 1 && userinfo.role != '3'"
                  shape="round"
                  size="mini"
                  @click="statusChange(item)"
                  >填写</a-button
                >
                <a-input
                  v-model:model-value="item.data.value"
                  v-if="item.data.acceptInput == 2"
                  size="mini"
                  style="width: 11rem; margin: 0 4px"
                ></a-input>
                <a-button
                  style="margin: 0 4px"
                  v-if="item.data.acceptInput == 2"
                  shape="round"
                  size="mini"
                  @click="confirmInfo(item)"
                  >确认</a-button
                >
              </template>
            </a-descriptions>
          </div>
        </div>
      </template>
    </BSCard>
    <BSSubHeader
      icon="security"
      iconClass="material-symbols-sharp"
      title="安全信息"
    >
    </BSSubHeader>
    <BSCard>
      <template #content>
        <div class="security" style="height: 900px">
          <div>
            <a-list size="large" :bordered="false" :split="true">
              <a-list-item v-if="userinfo.role != '3'">
                <ListItem icon="password" title="密码服务">
                  <template #content>
                    <a-button
                      type="primary"
                      size="large"
                      status="success"
                      shape="round"
                      @click="openPwdModal"
                      >修改密码</a-button
                    >
                    <a-modal
                      :visible="pwdModalVisible"
                      @cancel="pwdModalCancel"
                      :footer="false"
                      :unmount-on-close="true"
                    >
                      <template #title>
                        <span class="material-symbols-sharp">password</span>
                        <span>修改密码</span>
                      </template>
                      <div class="pwd-modal-content">
                        <a-form
                          :model="pwdForm"
                          ref="pwdFormRef"
                          @submit="pwdFormSubmit"
                        >
                          <a-form-item
                            :show-colon="true"
                            field="oldPwd"
                            label="旧密码"
                            :rules="[
                              pwdFormRule.pwdRule,
                              { required: true, message: '不能为空' },
                            ]"
                            :validate-trigger="['change']"
                          >
                            <a-input-password
                              v-model="pwdForm.oldPwd"
                              placeholder="旧密码"
                              clear
                            />
                          </a-form-item>
                          <a-form-item
                            :show-colon="true"
                            field="newPwd"
                            label="新密码"
                            :rules="[
                              pwdFormRule.pwdRule,
                              { required: true, message: '不能为空' },
                            ]"
                            :validate-trigger="['change']"
                          >
                            <a-input-password
                              v-model="pwdForm.newPwd"
                              placeholder="新密码"
                            />
                          </a-form-item>
                          <a-form-item
                            :show-colon="true"
                            field="confirmNewPwd"
                            label="确认密码"
                            :rules="[
                              { required: true, message: '不能为空' },
                              pwdFormRule.pwdRule,
                              pwdFormRule.confirmPwdRule,
                            ]"
                            :validate-trigger="['change']"
                          >
                            <a-input-password
                              v-model="pwdForm.confirmNewPwd"
                              placeholder="确认密码"
                            />
                          </a-form-item>
                          <a-form-item>
                            <div class="pwd-modal-btns">
                              <a-button-group>
                                <a-button
                                  html-type="submit"
                                  type="primary"
                                  shape="round"
                                  :loading="pwdForm.upPwdLoading"
                                >
                                  确认
                                </a-button>
                                <a-button
                                  type="outline"
                                  shape="round"
                                  @click="pwdModalCancel"
                                >
                                  取消
                                </a-button>
                              </a-button-group>
                            </div>
                          </a-form-item>
                        </a-form>
                      </div>
                    </a-modal>
                  </template>
                </ListItem>
              </a-list-item>
              <a-list-item></a-list-item>
            </a-list>
          </div>
        </div>
      </template>
    </BSCard>
  </div>
</template>

<script>
import { reactive, ref, computed } from "@vue/reactivity";
import ListItem from "@/components/ListItem";
import { NotificationSuccess, NotificationError } from "@/common/Notification";
import {
  reqFileUpload,
  reqUpAgentAvatar,
  reqUpAgentInfo,
  reqUpAgentPwd,
  reqUpCustomerAvatar,
  reqUpCustomerInfo,
  reqUpCustomerPwd,
} from "@/api/index";
import store from "@/store/index";
import { useDraggable } from "element-plus";
import { watch } from "@vue/runtime-core";
export default {
  name: "UserCenter",
  components: {
    ListItem,
  },
  setup() {
    const userstore = store.state.userstore;
    let avatarFileList = ref([]);
    let pwdModalVisible = ref(false);
    const pwdFormRef = ref(null);
    const userInfoDescriptions = ref([]);
    const pwdForm = reactive({
      oldPwd: "",
      newPwd: "",
      confirmNewPwd: "",
      upPwdLoading: false,
    });
    const pwdFormRule = {
      pwdRule: {
        validator: (value, cb) => {
          return new Promise((resolve, reject) => {
            console.log(value);
            if (value?.length < 6 || value?.length > 24) {
              cb("密码长度错误,6-24位");
            }
            resolve();
          });
        },
      },
      confirmPwdRule: {
        validator: (value, cb) => {
          return new Promise((resolve, reject) => {
            if (pwdForm.newPwd != pwdForm.confirmNewPwd) {
              cb("两次密码不一致");
            }
            resolve();
          });
        },
      },
    };

    function openPwdModal() {
      pwdModalVisible.value = true;
    }

    function pwdModalCancel() {
      pwdForm.oldPwd = "";
      pwdForm.newPwd = "";
      pwdForm.confirmNewPwd = "";
      pwdModalVisible.value = false;
    }

    function pwdFormSubmit(res) {
      //判断一下有没有校验错误
      if (res.errors) return;
      //按钮加载状态
      pwdForm.upPwdLoading = true;
      if (userinfo.value.role == "1") {
        reqUpCustomerPwd({
          phone: userinfo.value.phone,
          oldPassword: pwdForm.oldPwd,
          newPassword: pwdForm.newPwd,
        })
          .then((res) => {
            if (res.code == 1) {
              NotificationSuccess({
                title: "密码修改成功",
              });
              pwdForm.upPwdLoading = false;
              pwdModalCancel();
            } else {
              pwdFormRef.value.setFields({
                oldPwd: {
                  status: "error",
                  message: "旧密码错误",
                },
              });
              pwdForm.upPwdLoading = false;
            }
          })
          .catch((err) => {
            NotificationError({
              title: "密码修改失败",
            });
            pwdForm.upPwdLoading = false;
            pwdModalCancel();
          });
      } else if (userinfo.value.role == "2") {
        reqUpAgentPwd({
          phone: userinfo.value.phone,
          oldPassword: pwdForm.oldPwd,
          newPassword: pwdForm.newPwd,
        })
          .then((res) => {
            if (res.code == 1) {
              NotificationSuccess({
                title: "密码修改成功",
              });
              pwdForm.upPwdLoading = false;
              pwdModalCancel();
            } else {
              pwdFormRef.value.setFields({
                oldPwd: {
                  status: "error",
                  message: "旧密码错误",
                },
              });
              pwdForm.upPwdLoading = false;
            }
          })
          .catch((err) => {
            NotificationError({
              title: "密码修改失败",
            });
            pwdForm.upPwdLoading = false;
            pwdModalCancel();
          });
      } else {
        pwdForm.upPwdLoading = false;
      }
    }

    function avatarChange(value) {
      if (value) {
        let { file } = value[0];
        if (file) {
          let formdata = new FormData();
          formdata.append("file", file);
          reqFileUpload(formdata)
            .then((res) => {
              if (res.code == 1) {
                if (userinfo.value.role == "1") {
                  let req = reqUpCustomerAvatar({
                    id: userinfo.value.id,
                    avatar: res.data,
                  });
                  return Promise.resolve({ ossurl: res.data, req });
                } else if (userinfo.value.role == "2") {
                  let req = reqUpAgentAvatar({
                    id: userinfo.value.id,
                    avatar: res.data,
                  });
                  return Promise.resolve({ ossurl: res.data, req });
                }
              } else {
                return Promise.reject();
              }
            })
            .then((res) => {
              let { ossurl, req } = res;
              console.log(ossurl, req);
              Promise.race([req])
                .then((res) => {
                  console.log(res);
                  if (res.code == 1) {
                    NotificationSuccess({
                      title: "头像修改成功",
                    });
                  } else {
                    return Promise.reject();
                  }
                  // 状态管理修改
                  userstore.userinfo.avatar = ossurl;
                  //修改本地
                  let localUserInfo = JSON.parse(
                    localStorage.getItem("rjdlsInfo")
                  );
                  localUserInfo.avatar = ossurl;
                  localStorage.setItem(
                    "rjdlsInfo",
                    JSON.stringify(localUserInfo)
                  );
                })
                .catch((err) => {
                  NotificationError({
                    title: "头像修改失败",
                  });
                });
            })
            .catch((err) => {
              NotificationError({
                title: "头像修改失败",
              });
            });
        }
      }
      // 清空列表
      avatarFileList.value = [];
    }

    function statusChange(item) {
      console.log(item);
      item.data.acceptInput = 2;
    }

    function confirmInfo(item) {
      item.data.acceptInput = 1;
      // 判断角色
      if (userinfo.value.role == "1") {
        reqUpCustomerInfo({
          id: userinfo.value.id,
          cuName: item.data.value,
        })
          .then((res) => {
            if (res.code == 1) {
              NotificationSuccess({
                title: "信息更新成功",
              });
              // 状态管理修改
              userstore.userinfo.cuName = item.data.value;
              //修改本地
              let localUserInfo = JSON.parse(localStorage.getItem("rjdlsInfo"));
              localUserInfo.cuName = item.data.value;
              localStorage.setItem("rjdlsInfo", JSON.stringify(localUserInfo));
            } else {
              return Promise.reject();
            }
          })
          .catch((err) => {
            NotificationError({
              title: "信息更新失败",
            });
          });
      } else if (userinfo.value.role == "2") {
        reqUpAgentInfo({
          id: userinfo.value.id,
          agentName: item.data.value,
        })
          .then((res) => {
            if (res.code == 1) {
              NotificationSuccess({
                title: "信息更新成功",
              });
            } else {
              return Promise.reject();
            }
            // 状态管理修改
            userstore.userinfo.agentName = item.data.value;
            //修改本地
            let localUserInfo = JSON.parse(localStorage.getItem("rjdlsInfo"));
            localUserInfo.agentName = item.data.value;
            localStorage.setItem("rjdlsInfo", JSON.stringify(localUserInfo));
          })
          .catch((err) => {
            NotificationError({
              title: "信息更新失败",
            });
          });
      } 
    }

    watch(
      () => userstore.userinfo,
      (nv, ov) => {
        userInfoDescriptions.value = [
          {
            label: "账号",
            acceptInput: 0,
            enLabel: "phone",
            value: nv.phone,
          },
          {
            label: "姓名",
            acceptInput: 1,
            enLabel: "name",
            value: nv.cuName || nv.agentName || nv.adminName,
          },
        ];
      },
      {
        immediate: true,
        deep: true,
      }
    );

    const userinfo = computed(() => {
      let data = userstore.userinfo;
      return data;
    });

    return {
      avatarFileList,
      pwdModalVisible,
      pwdFormRef,
      pwdForm,
      pwdFormRule,
      openPwdModal,
      pwdModalCancel,
      pwdFormSubmit,
      avatarChange,
      statusChange,
      confirmInfo,
      userInfoDescriptions,
      userinfo,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common.scss";
.el-divider {
  margin: 1rem 0;
}

.arco-upload-hide {
  display: block !important;
}
.userc-wrapper {
  width: 100%;

  & .title {
    text-align: left;
    font-size: 1.5rem;
    box-sizing: border-box;
    padding: 0 1rem;
    display: flex;
    align-items: center;
  }

  & .info-show {
    display: flex;
    flex-direction: row;

    & .portrait {
      display: flex;
      flex-direction: column;
      padding: 0 1rem;

      & .portrait-btns {
        display: flex;
        justify-content: center;
        padding: 5px;
      }
    }
    & .info {
      padding: 0 1rem;
    }
  }
}

.pwd-modal-btns {
  width: 100%;
  text-align: end;
}

.pwd-modal-content {
  padding: 0 1rem 0 0;
}
</style>