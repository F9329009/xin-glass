<template>
  <a-layout>
    <!-- 左边侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <!-- logo -->
      <div class="logo" style="text-align: center">管理系统</div>
      <!-- 功能列表 -->
      <a-menu
        theme="dark"
        mode="inline"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
      >
        <template v-for="item in navList" :key="item.menu_id">
          <!-- 没有二级目录 -->
          <a-menu-item
            :key="item.menu_id"
            v-if="item.children.length <= 0"
            @click="addTabs(item)"
          >
            <!-- <router-link :to="item.url">
              <user-outlined />
              {{ item.menu_name }}
            </router-link> -->
            {{ item.menu_name }}
          </a-menu-item>
          <!-- 有二级目录 -->
          <a-sub-menu :key="item.menu_id" v-else>
            <template #title>
              <span>
                <user-outlined />
                <span>
                  {{ item.menu_name }}
                </span>
              </span>
            </template>
            <a-menu-item
              v-for="item1 in item.children"
              :key="item1.menu_id"
              @click="addTabs(item1)"
            >
              <!-- <router-link :to="item1.url">
                {{ item1.menu_name }}
              </router-link> -->
              {{ item1.menu_name }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <!-- 右边功能区 -->
    <a-layout>
      <a-layout-header style="position: relative; background: #fff; padding: 0">
        <!-- 左侧边栏缩放图标 -->
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <span class="company-name">{{ companyName }}</span>
        <a-button class="logOut" type="danger" @click="handleLogout">
          退出登录
        </a-button>
      </a-layout-header>
      <!-- 主页面 -->
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: 'auto',
        }"
      >
        <!-- 标签页 -->
        <a-tabs
          v-model:activeKey="activeKeyTabs"
          hide-add
          type="editable-card"
          @edit="onEditTabs"
          @change="changeTabs"
        >
          <a-tab-pane
            v-for="(item, i) in tabsList"
            :key="item.key"
            :tab="item.title"
            :closable="i > 0"
          >
            <!-- {{ item }} -->
            <!-- 子路由渲染 -->
            <router-view :name="item.url_name" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons-vue";

import { Admin } from "./index.ts";

export default defineComponent({
  setup() {
    return { ...Admin() };
  },
  components: {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>
