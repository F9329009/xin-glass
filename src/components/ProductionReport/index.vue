<template>
  <div style="margin-bottom: 20px">
    <a-row type="flex" justify="space-between">
      <!-- 查询 -->
      <a-col :span="5">
        <a-row type="flex">
          <a-col :span="24">
            <a-card title="查询日期" style="margin-bottom: 20px">
              <template #extra>
                <a-button type="primary" @click="getProductionReportList">
                  查询
                </a-button>
              </template>
              <a-input-group style="text-align: center">
                <a-range-picker
                  v-model:value="reportDateValue"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onChangeDate"
                >
                  <template #renderExtraFooter>
                    <span style="color: green">
                      请选择要查询的开始日期和结束日期(查询一天请选择同一天)
                    </span>
                  </template>
                </a-range-picker>
              </a-input-group>
            </a-card>
          </a-col>
          <!-- 总统计 -->
          <a-col :span="24">
            <a-card title="总统计" style="margin-bottom: 20px">
              <!-- <template #extra><a href="#">more</a></template> -->
              <p>综合成品率：{{ productionReportAllTotal.ProductRate }}</p>
              <p>
                综合成品率(折5厘)：{{ productionReportAllTotal.ProductRate }}
              </p>
              <p>总破损量：{{ productionReportAllTotal.DamageArea }}</p>
              <p>
                总破损量(折5厘)：{{
                  productionReportAllTotal.ConvertDamageArea
                }}
              </p>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <!-- 各工序统计 -->
      <a-col :span="18">
        <a-card title="各工序统计">
          <!-- <template #extra><a href="#">more</a></template> -->
          <a-table
            :columns="processColumns"
            :row-key="(record) => record.WTCode"
            :data-source="productionReportGroupTotal"
            :loading="processLoading"
            :style="
              productionReportGroupTotal.length > 0 ? { height: '700px' } : {}
            "
          >
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <!-- 班组统计 -->
  <a-table
    :columns="groupColumns"
    :row-key="(record) => record.WTCode"
    :data-source="productionReportList"
    :loading="groupLoading"
    :pagination="false"
  >
    <template #operation="{ text }">{{ text }}</template>
  </a-table>
</template>

<script>
import { defineComponent } from "vue";

import { ProductionReport } from "./index.ts";

export default defineComponent({
  setup() {
    return { ...ProductionReport() };
  },
});
</script>

<style scoped>
/* @import url("./index.css"); */
.ant-calendar-picker {
  width: 100%;
}
</style>
