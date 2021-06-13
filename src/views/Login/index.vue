<template>
  <div class="container">
    <div class="login-top">
      <span class="login-top-title">管理系统</span>
      <span class="login-top-subtitle">玻璃生产管理</span>
    </div>
    <div class="login-box">
      <!-- 表单 -->
      <a-form
        name="custom-validation"
        ref="loginFormRef"
        :model="loginModel"
        :rules="loginRules"
        v-bind="layout"
        @finish="handleLogin"
        hideRequiredMark
      >
        <a-input-group>
          <a-form-item required has-feedback ref="name" name="name">
            <a-input
              v-model:value="loginModel.name"
              type="text"
              placeholder="请输入手机号码"
              size="large"
            >
              <template #prefix>
                <MobileOutlined style="color: #1890ff" />
              </template>
            </a-input>
          </a-form-item>
        </a-input-group>
        <a-form-item required has-feedback name="password">
          <a-input-password
            v-model:value="loginModel.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined style="color: #1890ff" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-checkbox
          v-model:checked="checkedAutoLogin"
          @change="handleIsAutoLogin"
          >自动登录</a-checkbox
        >
        <a-form-item style="margin-top: 30px">
          <a-button
            type="primary"
            html-type="submit"
            style="width: 100%; height: 40px; padding: 0 15px; font-size: 16px"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Login } from "./index.ts";

import { MobileOutlined, LockOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    return { ...Login() };
  },
  components: {
    MobileOutlined,
    LockOutlined,
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>
