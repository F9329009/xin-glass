<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// 国际化配置
import zhCN from "ant-design-vue/es/locale/zh_CN";

export default defineComponent({
  setup() {
    const locale = ref(zhCN);
    return { locale };
  },
});
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
</style>
