<template>
  <div>
    <button @click="getTest">Get测试</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Register } from "./index.ts";

export default defineComponent({
  setup() {
    return { ...Register() };
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>
