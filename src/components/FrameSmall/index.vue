<template>
  <div style="margin-bottom: 20px">
    <a-page-header
      class="demo-page-header"
      style="border: 1px solid rgb(235, 237, 240); margin-bottom: 8px"
      :title="`玻璃架(${frameListSearch.length}/${frameList.length})`"
      sub-title="查询/跟踪补片进度"
    >
      <template #extra>
        <a-button key="1" type="primary" @click="handleNewFrameVisible">
          新增玻璃架
        </a-button>
        <a-button
          key="2"
          style="background-color: #52c41a; color: #fff"
          @click="getFrameList"
        >
          刷新列表
        </a-button>
      </template>
      <a-descriptions size="small" :column="3">
        <!-- <a-descriptions-item label="补片日期">
          <a-input-group>
            <a-range-picker
              v-model:value="frameDateValue"
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
            <a-button
              type="primary"
              @click="getFrameList"
              style="margin-left: 8px"
            >
              查询
            </a-button>
          </a-input-group>
        </a-descriptions-item> -->

        <a-descriptions-item label="玻璃架状态">
          <a-radio-group v-model:value="frameValue" button-style="solid">
            <a-radio-button value="all">全部</a-radio-button>
            <a-radio-button value="normal">正常</a-radio-button>
            <a-radio-button value="scrap">报废</a-radio-button>
            <a-radio-button value="lose">丢失</a-radio-button>
          </a-radio-group>
        </a-descriptions-item>

        <a-descriptions-item label="使用者">
          <a-select
            style="width: 160px"
            v-model:value="useValue"
            placeholder="请选择"
            :dropdownMatchSelectWidth="false"
            show-search
            @search="handleSearchClient"
          >
            <a-select-option
              :value="item"
              v-for="item in useListSearch"
              :key="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
      </a-descriptions>
    </a-page-header>

    <!-- 玻璃架列表 -->
    <a-table
      :columns="frameColumns"
      :row-key="(record) => record.frame_id"
      :data-source="frameListSearch"
      :loading="frameLoading"
      :pagination="false"
    >
      <template #frame_name="{ text, record }">
        <div class="editable-cell">
          <div
            v-if="frameNameEditableData[record.frame_id]"
            class="editable-cell-input-wrapper"
          >
            <a-input
              v-model:value="editableData[record.frame_id].frame_name"
              @pressEnter="frameNameSave(record.frame_id, record.frame_name)"
            />
            <check-outlined
              class="editable-cell-icon-check"
              @click="frameNameSave(record.frame_id, record.frame_name)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || " " }}
            <edit-outlined
              class="editable-cell-icon"
              @click="frameNameEdit(record.frame_id)"
            />
          </div>
        </div>
      </template>
      <template #user_name="{ text }">
        <a-tag :color="text === company_mini_name ? 'green' : 'orange'">
          {{ text }}
        </a-tag>
      </template>
      <template #partition_name="{ text }">
        <a-tag :color="text === '' ? 'default' : '#52C41A'">
          {{ text === "" ? "-" : text }}
        </a-tag>
      </template>
      <template #place_x="{ text }">
        <a-tag color="#FF7875" v-if="text < 0"> - </a-tag>
        <a-tag color="#52C41A" v-else> {{ text }} </a-tag>
      </template>
      <template #place_y="{ text }">
        <a-tag color="#FF7875" v-if="text < 0"> - </a-tag>
        <a-tag color="#52C41A" v-else> {{ text }} </a-tag>
      </template>
      <template #place_z="{ text }">
        <a-tag color="#FF7875" v-if="text < 0"> - </a-tag>
        <a-tag color="#52C41A" v-else> {{ text }} </a-tag>
      </template>
      <template #is_states="{ text }">
        <a-tag color="default" v-if="text === 0">删除</a-tag>
        <a-tag color="success" v-if="text === 1">正常</a-tag>
        <a-tag color="warning" v-if="text === 2">报废</a-tag>
        <a-tag color="error" v-if="text === 3">丢失</a-tag>
      </template>
      <!-- <template #operation="{ text }">{{ text }} </template> -->
    </a-table>

    <!-- 玻璃架列表 -->
    <a-row type="flex" :gutter="[0, 16]">
      <a-col :span="24" v-for="item in FrameListSearch" :key="item.id">
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
            <a-row type="flex" justify="space-around" :gutter="[0, 16]">
              <!-- 备注 -->
              <a-col :span="18">
                <a-tag color="#3B5999"> 备注 </a-tag>
                <!-- <a-tag> {{ item.workcontent }} </a-tag> -->
                <span> {{ item.id }}</span>
              </a-col>
              <!-- 补片原因 -->
              <a-col
                :span="6"
                style="padding-left: 8px; border-left: 1px solid #f0f0f0"
              >
                <a-tag color="#3B5999"> {{ item.frame_name }}原因 </a-tag>
                <a-tag> {{ item.is_states }} </a-tag>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <!-- 新增玻璃架 - 对话框 -->
    <a-modal v-model:visible="newFrameVisible" title="新增玻璃架">
      <!-- 自定义页脚 -->
      <template #footer>
        <a-button key="back" @click="handleCancelNewFrame">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="newFrameLoading"
          @click="handleOkNewFrame"
        >
          新增
        </a-button>
      </template>
      <!-- 内容 -->
      <a-input
        v-model:value="newFrameNameValue"
        placeholder="请输入你要新增的玻璃架名称"
        allow-clear
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Frame } from "./index.ts";

import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";

export default defineComponent({
  setup() {
    return { ...Frame() };
  },
  components: {
    CheckOutlined,
    EditOutlined,
  },
});
</script>

<style scoped>
@import url("./index.css");
</style>

<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
