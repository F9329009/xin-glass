import { computed, ref } from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { alionErp } from "../../api";

import moment from "moment";
import { Moment } from "moment";

import { message } from "ant-design-vue";
// 补片表头配置
const patchColumns = [
  {
    // 标题
    title: "条码",
    // 数据中的 key
    dataIndex: "id",
    // 插槽
    slots: { customRender: "id" },
    // 排序
    // sorter: true,
  },
  {
    title: "客户",
    dataIndex: "custbrief",
  },
  {
    title: "订单编号",
    dataIndex: "SONO",
  },
  {
    title: "流程卡号",
    dataIndex: "PCNO",
  },
  {
    title: "订单序号",
    dataIndex: "SOSeqNo",
  },
  {
    title: "成品名称",
    dataIndex: "itemname",
  },
  {
    title: "长度",
    dataIndex: "ItemLength",
  },
  {
    title: "宽度",
    dataIndex: "ItemWidth",
  },
  {
    title: "数量",
    dataIndex: "Qty",
  },
  {
    title: "已开工数量",
    dataIndex: "StartQty",
  },
  {
    title: "已完结数量",
    dataIndex: "FinishQty",
  },
  {
    title: "备注",
    dataIndex: "workcontent",
  },
  {
    title: "补片类型",
    dataIndex: "typename",
  },
  {
    title: "工艺流程",
    dataIndex: "RouteStr",
  },
  {
    title: "补片原因",
    dataIndex: "Remark",
  },
  {
    title: "申报班组",
    dataIndex: "frWTName",
  },
  {
    title: "责任班组",
    dataIndex: "toWTName",
  },
  {
    title: "补片人",
    dataIndex: "Approver",
  },
  {
    title: "补片单审核时间",
    dataIndex: "ApproveDate",
  },
  {
    title: "最后交出",
    dataIndex: "log_FRWIPName",
  },
  {
    title: "当前接收",
    dataIndex: "log_ToWIPName",
  },
  {
    title: "最后交接时间",
    dataIndex: "log_approvedate",
  },
];

export const Patch = () => {
  // 补片数据
  const patchList = ref<[]>([]);

  //#region 日期选择
  // 时间
  const patchDateValue = ref<Moment[]>([moment(), moment()]);
  let patchDate = {
    startdate: moment().format("YYYY-MM-DD"),
    enddate: moment().format("YYYY-MM-DD"),
  };
  // 日期改变
  const onChangeDate = (value: Moment[], dateString: string[]) => {
    patchDate = {
      startdate: value[0].format("YYYY-MM-DD"),
      enddate: value[1].format("YYYY-MM-DD"),
    };
  };
  //#endregion

  //#region 获取 补片 数据
  // 是否在加载数据
  const patchLoading = ref<boolean>(false);

  // 请求数据
  const getPatchList = () => {
    // 清空补片状态
    stateValue.value = "all";
    clientValue.value = "全部";

    // 正在加载数据
    patchLoading.value = true;

    httpGet(alionErp.Patch, patchDate)
      .then((res: any) => {
        console.log(res);
        if (res.meta.status === 200) {
          // 弹出提示
          message.success(res.meta.msg);

          // 客户名称搜索框
          clientListSearch.value = ["全部"];
          res.message.data.forEach((item: any) => {
            if (clientListSearch.value.indexOf(item.custbrief) === -1) clientListSearch.value.push(item.custbrief);
          });

          patchList.value = res.message.data;
        } else {
          message.error(res.meta.msg);
        }

        // 数据加载完成
        patchLoading.value = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  //#endregion

  //#region 条件搜索
  // 补片状态
  const stateValue = ref<string>("all");
  // 客户名称
  const clientValue = ref<string>("全部");
  // 客户列表
  const clientList = ref<string[]>([]);
  const clientListSearch = ref<string[]>([]);

  const patchListSearch = computed(() => {
    const list: any[] = [];

    // 清空客户列表
    clientList.value = [];
    patchList.value.forEach((item: any) => {
      // 保存客户名称
      if (clientList.value.indexOf(item.custbrief) === -1) {
        clientList.value.push(item.custbrief);
      }

      // 是否显示
      let isShow = false;

      // 补片状态筛选
      switch (stateValue.value) {
        case "not":
          if (item.StartQty === 0 && item.FinishQty === 0) isShow = true;
          break;
        case "start":
          if (item.StartQty > 0 && item.FinishQty < item.Qty) isShow = true;
          break;
        case "end":
          if (item.FinishQty === item.Qty) isShow = true;
          break;
        default:
          isShow = true;
          break;
      }

      // 客户名称筛选
      if (isShow) {
        // 默认不显示 条件满足再显示
        isShow = false;
        if (clientValue.value === "全部" || clientValue.value.length <= 0) isShow = true;
        if (item.custbrief.indexOf(clientValue.value) >= 0) isShow = true;
      }

      // 加入显示列表
      if (isShow) list.push(item);
    });

    return list;
  });

  // 文本框值变化时的回调
  const handleSearchClient = (value: string) => {
    clientListSearch.value = ["全部"];
    clientList.value.forEach(item => {
      if (item.indexOf(value) >= 0) {
        clientListSearch.value.push(item);
      }
    });
  };

  //#endregion

  return {
    patchColumns,
    patchList,
    patchLoading,
    getPatchList,
    onChangeDate,
    patchDateValue,
    stateValue,
    clientValue,
    clientList,
    handleSearchClient,
    patchListSearch,
    clientListSearch,
  };
};
