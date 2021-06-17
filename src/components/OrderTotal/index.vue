<!--
 * @Author: 九玖
 * @Date: 2021-06-17 14:40:11
 * @LastEditTime: 2021-06-17 15:41:32
 * @LastEditors: 九玖
 * @Description: 订单统计
 * @FilePath: \xin-glass\src\components\OrderTotal\index.vue
-->

<template>
  <div style="margin-bottom: 20px">
    <a-row type="flex" justify="space-between">
      <a-page-header
        class="demo-page-header"
        style="border: 1px solid rgb(235, 237, 240); margin-bottom: 8px"
        :title="`订单统计(${orderTotalList.length}/${orderTotalList.length})`"
        sub-title="查询前台下单统计"
      >
        <!-- 右上角按钮 -->
        <template #extra>
          <!--  -->
        </template>
        <!-- 功能区 -->
        <a-descriptions size="small" :column="3">
          <a-descriptions-item label="查询日期">
            <a-date-picker v-model:value="orderTotalDateValue" />
            <a-button
              style="margin-left: 6px"
              type="primary"
              @click="getOrderTotalList"
            >
              查询
            </a-button>
          </a-descriptions-item>
        </a-descriptions>
      </a-page-header>

      <!-- 查询 -->
      <a-col :span="5">
        <a-row type="flex">
          <!-- 总统计 -->
          <a-col :span="24">
            <a-card title="总统计" style="margin-bottom: 20px">
              <!-- <template #extra><a href="#">more</a></template> -->
              <p>订单数量：{{ orderTotalTotal.TotalNum }}</p>
              <p>成品数量：{{ orderTotalTotal.TotalQty }}</p>
              <p>合计面积：{{ orderTotalTotal.TotalArea }}</p>
              <p>合计面积(折5厘)：{{ orderTotalTotal.TotalConvertArea }}</p>
              <p>合计金额：{{ orderTotalTotal.TotalAmt }}</p>
              <p>合计预付定金：{{ orderTotalTotal.TotalPrePayAmt }}</p>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <!-- 各工序统计 -->
      <a-col :span="18">
        <!-- 班组统计 -->
        <a-table
          :columns="orderColumns"
          :row-key="(record) => record.ChsName"
          :data-source="orderTotalList"
          :loading="orderTotalLoading"
          :pagination="false"
        >
        </a-table
      ></a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { OrderTotal } from "./index.ts";

export default defineComponent({
  setup() {
    return { ...OrderTotal() };
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>
