<template>
  <div style="margin-bottom: 20px">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 10px"
      title="补片明细"
      sub-title="查询/跟踪补片进度"
    >
      <template #extra>
        <!-- <a-button key="3">Operation</a-button>
        <a-button key="2">Operation</a-button>
        <a-button key="1" type="primary">Primary</a-button> -->
      </template>
      <a-descriptions size="small" :column="3">
        <a-descriptions-item label="补片日期">
          <a-input-group>
            <a-range-picker
              v-model:value="patchDateValue"
              format="YYYY-MM-DD"
              :placeholder="['开始时间', '结束时间']"
              @change="onChangeDate"
              style="vertical-align: bottom"
            >
              <template #renderExtraFooter>
                <span style="color: green">
                  请选择要查询的开始日期和结束日期(查询一天请选择同一天)
                </span>
              </template>
            </a-range-picker>
            <!-- 查询按钮 -->
            <a-button
              type="primary"
              @click="getPatchList"
              style="margin-left: 8px"
            >
              查询
            </a-button>
          </a-input-group>
        </a-descriptions-item>

        <a-descriptions-item label="补片状态">
          <a-radio-group v-model:value="stateValue" button-style="solid">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="not">未开工</a-radio-button>
            <a-radio-button value="start">已开工未完结</a-radio-button>
            <a-radio-button value="end">已完结</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>

        <a-descriptions-item label="客户名称">
          <a-select
            style="width: 160px"
            v-model:value="clientValue"
            placeholder="请选择客户"
            :dropdownMatchSelectWidth="false"
            show-search
            @search="handleSearchClient"
          >
            <a-select-option
              :value="item"
              v-for="item in clientListSearch"
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>
    <!-- 补片明细 -->
    <a-row
      type="flex"
      :gutter="[16, { xs: 8, sm: 16, md: 24, lg: 32, xl: 32, xxl: 32 }]"
    >
      <a-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 12 }"
        :lg="{ span: 8 }"
        :xl="{ span: 6 }"
        :xxl="{ span: 6 }"
        v-for="item in patchListSearch"
        :key="item.id"
      >
        <a-card style="width: 100%" bodyStyle="padding: 12px">
          <!-- 底部按钮 -->
          <template class="ant-card-actions" #actions>
            <!-- <setting-outlined key="setting" />
            <edit-outlined key="edit" />
            <ellipsis-outlined key="ellipsis" /> -->
          </template>

          <!-- 内容 -->
          <div>
            <a-row
              type="flex"
              style="
                border-bottom: 1px solid #f0f0f0;
                padding-bottom: 10px;
                margin-bottom: 10px;
              "
            >
              <a-col :span="12" style="margin-bottom: 10px">
                <a-row :gutter="[0, 16]" style="padding-bottom: 10px">
                  <a-col :span="24">
                    <!-- 补片条码 -->
                    <a-tag color="#1890ff"> -{{ item.id }} </a-tag>
                    <!-- 订单序号 -->
                    <a-tag color="#881bf1"> {{ item.SOSeqNo }} </a-tag>
                    <!-- 补片类型 -->
                    <a-tag color="cyan"> {{ item.typename }} </a-tag>
                  </a-col>
                  <!-- 订单编号 -->
                  <a-col :span="24">
                    <a-tag color="orange"> 订单编号 </a-tag>
                    <a-tag> {{ item.SONO }} </a-tag>
                  </a-col>
                  <!-- 流程卡号 -->
                  <a-col :span="24">
                    <a-tag color="purple"> 流程卡号 </a-tag>
                    <a-tag> {{ item.PCNO }} </a-tag>
                  </a-col>

                  <!-- 分隔条 -->
                  <a-divider orientation="left">补片状态</a-divider>

                  <a-col
                    :span="12"
                    style="padding-left: 6px; padding-bottom: 10px"
                  >
                    <a-row
                      :gutter="[0, 16]"
                      style="border-right: 1px solid #f0f0f0"
                    >
                      <!-- 已开工数量 -->
                      <a-col :span="24">
                        <a-tag color="#fa8c16"> 开工 </a-tag>
                        <a-tag
                          :color="
                            item.StartQty === 0
                              ? 'default'
                              : item.StartQty === item.Qty
                              ? 'green'
                              : 'blue'
                          "
                        >
                          {{ item.StartQty }}
                        </a-tag>
                      </a-col>
                      <!-- 已完结数量 -->
                      <a-col :span="24">
                        <a-tag color="#fa8c16">完结</a-tag>
                        <a-tag
                          :color="
                            item.FinishQty === 0
                              ? 'default'
                              : item.FinishQty === item.Qty
                              ? 'green'
                              : 'blue'
                          "
                        >
                          {{ item.FinishQty }}
                        </a-tag>
                      </a-col>
                    </a-row>
                  </a-col>

                  <a-col :span="12" style="padding-left: 6px">
                    <a-row :gutter="[0, 16]">
                      <!-- 最后交出 -->
                      <a-col :span="24">
                        <a-tag color="#1890ff"> 交出 </a-tag>
                        <a-tag> {{ item.log_FRWIPName }} </a-tag>
                      </a-col>
                      <!-- 当前接收 -->
                      <a-col :span="24">
                        <a-tag color="#1890ff"> 接收 </a-tag>
                        <a-tag> {{ item.log_ToWIPName }} </a-tag>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>

                <!-- 最后交接时间 -->
                <a-col :span="24" style="padding-top: 10px">
                  <a-tag color="pink"> 交接时间 </a-tag>
                  <a-tag> {{ item.log_approvedate }} </a-tag>
                </a-col>
              </a-col>

              <a-col
                :span="12"
                style="padding-left: 6px; border-left: 1px solid #f0f0f0"
              >
                <!-- 规格数量 -->
                <a-row
                  type="flex"
                  justify="space-around"
                  style="text-align: center; font-size: 16px"
                  :gutter="[0, 16]"
                >
                  <!-- 长度 -->
                  <a-col :span="8">
                    <a-tag color="orange" style="font-size: 16px">
                      {{ item.ItemLength }}
                    </a-tag>
                  </a-col>
                  <a-col :span="1">×</a-col>
                  <!-- 宽度 -->
                  <a-col :span="8">
                    <a-tag color="orange" style="font-size: 16px">
                      {{ item.ItemWidth }}
                    </a-tag>
                  </a-col>
                  <a-col :span="1">=</a-col>
                  <!-- 数量 -->
                  <a-col :span="6">
                    <a-tag color="green" style="font-size: 16px">
                      {{ item.Qty }}
                    </a-tag>
                  </a-col>
                </a-row>
                <!-- 分隔条 -->
                <a-divider orientation="left">申报信息</a-divider>
                <!-- 申报信息 -->
                <a-row :gutter="[0, 16]">
                  <!-- 申报班组 -->
                  <a-col :span="24">
                    <a-tag color="blue"> 申报 </a-tag>
                    <a-tag> {{ item.frWTName }} </a-tag>
                  </a-col>
                  <!-- 责任班组 -->
                  <a-col :span="24">
                    <a-tag color="blue"> 责任 </a-tag>
                    <a-tag> {{ item.toWTName }} </a-tag>
                  </a-col>
                  <!-- 补片原因 -->
                  <a-col :span="24">
                    <a-tag color="blue"> {{ item.typename }}原因 </a-tag>
                    <a-tag> {{ item.Remark }} </a-tag>
                  </a-col>
                  <!-- 补片人 -->
                  <a-col :span="24">
                    <a-tag color="blue"> 申报人 </a-tag>
                    <a-tag> {{ item.Approver }} </a-tag>
                  </a-col>
                  <!-- 补片时间 -->
                  <a-col :span="24">
                    <a-tag color="pink"> 申报时间 </a-tag>
                    <a-tag> {{ item.ApproveDate }} </a-tag>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-row
              type="flex"
              justify="space-around"
              :gutter="[0, 16]"
              style="border-bottom: 1px solid #f0f0f0"
            >
              <!-- 客户名称 -->
              <a-col :span="24">
                <a-tag color="#09a74d"> 客户名称 </a-tag>
                <!-- <a-tag> {{ item.custbrief }} </a-tag> -->
                <span>{{ item.custbrief }}</span>
              </a-col>
              <!-- 成品名称 -->
              <a-col :span="24">
                <a-tag color="#C43E1C"> 成品名称 </a-tag>
                <!-- <a-tag> {{ item.itemname }} </a-tag> -->
                <span>{{ item.itemname }}</span>
              </a-col>
              <!-- 工艺流程 -->
              <a-col :span="24">
                <a-tag color="pink"> 完整工艺流程 </a-tag>
                <!-- <a-tag> {{ item.RouteStr }} </a-tag> -->
                <span>{{ item.RouteStr }}</span>
              </a-col>
            </a-row>

            <a-row
              type="flex"
              justify="space-around"
              :gutter="[0, 16]"
              style="margin-top: 10px"
            >
              <!-- 备注 -->
              <a-col :span="24">
                <a-tag color="#3B5999"> 备注 </a-tag>
                <!-- <a-tag> {{ item.workcontent }} </a-tag> -->
                <span> {{ item.workcontent }}</span>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 补片明细2 -->
    <!-- <a-card title="补片明细">
      <a-table
        :columns="patchColumns"
        :row-key="(record) => record.ID"
        :data-source="patchList"
        :loading="patchLoading"
        :style="patchList.length > 0 ? { height: '700px' } : {}"
      >
        <template #id="{ text }">-{{ text }}</template>
      </a-table>
    </a-card> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Patch } from "./index.ts";

export default defineComponent({
  setup() {
    return { ...Patch() };
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>
