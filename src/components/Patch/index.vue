<template>
  <div style="margin-bottom: 20px">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 8px"
      :title="`补片明细(${patchListSearch.length}/${patchList.length})`"
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
    <a-row type="flex" :gutter="[0, 16]">
      <a-col :span="24" v-for="item in patchListSearch" :key="item.id">
        <a-card
          style="width: 100%"
          bodyStyle="padding: 12px; box-shadow: 0 6px 10px rgb(0 0 0 / 6%);"
        >
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
                padding-bottom: 8px;
                margin-bottom: 8px;
              "
            >
              <a-col :span="7" style="margin-bottom: 8px">
                <a-row :gutter="[0, 16]" style="padding-bottom: 8px">
                  <a-col :span="12" style="border-bottom: 1px solid #f0f0f0">
                    <!-- 补片类型 -->
                    <a-tag color="cyan"> {{ item.typename }} </a-tag>
                    <!-- 补片条码 -->
                    <a-popover placement="top">
                      <template #content>
                        <p>用于补片单交接,在所有补片单中唯一</p>
                      </template>
                      <template #title>
                        <span>补片条码</span>
                      </template>
                      <a-tag color="#1890ff"> -{{ item.id }} </a-tag>
                    </a-popover>
                    <!-- 订单序号 -->
                    <a-popover placement="top">
                      <template #content>
                        <p>在该订单中唯一</p>
                      </template>
                      <template #title>
                        <span>订单序号</span>
                      </template>
                      <a-tag color="#881bf1"> {{ item.SOSeqNo }} </a-tag>
                    </a-popover>
                  </a-col>

                  <a-col
                    :span="12"
                    style="
                      border-bottom: 1px solid #f0f0f0;
                      border-left: 1px solid #f0f0f0;
                    "
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
                  </a-col>

                  <a-col :span="12" style="border-bottom: 1px solid #f0f0f0">
                    <!-- 订单编号 -->
                    <a-tag color="orange"> 订单编号 </a-tag>
                    <a-tag> {{ item.SONO }} </a-tag>
                  </a-col>

                  <a-col :span="12" style="border-bottom: 1px solid #f0f0f0">
                    <!-- 流程卡号 -->
                    <a-tag color="purple"> 流程卡号 </a-tag>
                    <a-tag> {{ item.PCNO }} </a-tag>
                  </a-col>
                </a-row>
              </a-col>

              <a-col
                :span="7"
                style="padding-left: 8px; border-left: 1px solid #f0f0f0"
              >
                <a-row type="flex" justify="space-around" :gutter="[0, 16]">
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
                    <a-tag color="pink"> 工艺流程 </a-tag>
                    <!-- <a-tag> {{ item.RouteStr }} </a-tag> -->
                    <span>{{ item.RouteStr }}</span>
                  </a-col>
                </a-row>
              </a-col>

              <a-col
                :span="4"
                style="padding-left: 8px; border-left: 1px solid #f0f0f0"
              >
                <!-- 补片状态 -->
                <a-row :gutter="[0, 16]">
                  <a-col :span="10">
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

                  <a-col
                    :span="14"
                    style="padding-left: 8px; border-left: 1px solid #f0f0f0"
                  >
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

                  <!-- 最后交接时间 -->
                  <a-col :span="24">
                    <a-tag color="pink"> 最后交接时间 </a-tag>
                    <a-tag> {{ item.log_approvedate }} </a-tag>
                  </a-col>
                </a-row>
              </a-col>

              <a-col
                :span="6"
                style="padding-left: 8px; border-left: 1px solid #f0f0f0"
              >
                <!-- 申报信息 -->
                <a-row :gutter="[0, 16]">
                  <!-- 申报班组 -->
                  <a-col :span="12">
                    <a-tag color="blue"> 申报 </a-tag>
                    <a-tag> {{ item.frWTName }} </a-tag>
                  </a-col>
                  <!-- 责任班组 -->
                  <a-col :span="12">
                    <a-tag color="blue"> 责任 </a-tag>
                    <a-tag> {{ item.toWTName }} </a-tag>
                  </a-col>
                  <!-- 补片人 -->
                  <a-col :span="24">
                    <a-tag color="blue"> 申报人员 </a-tag>
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

            <a-row type="flex" justify="space-around" :gutter="[0, 16]">
              <!-- 备注 -->
              <a-col :span="18">
                <a-tag color="#3B5999"> 备注 </a-tag>
                <!-- <a-tag> {{ item.workcontent }} </a-tag> -->
                <span> {{ item.workcontent }}</span>
              </a-col>
              <!-- 补片原因 -->
              <a-col
                :span="6"
                style="padding-left: 8px; border-left: 1px solid #f0f0f0"
              >
                <a-tag color="#3B5999"> {{ item.typename }}原因 </a-tag>
                <a-tag> {{ item.Remark }} </a-tag>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
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
