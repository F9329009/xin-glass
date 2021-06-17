import { ref } from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { alionErp } from "../../api";

import moment from "moment";
import { Moment } from "moment";

import { message } from "ant-design-vue";

// 订单统计表头配置
const orderColumns = [
  // {
  //   title: "编号",
  //   dataIndex: "index",
  // },
  {
    // 标题
    title: "成品名称",
    // 数据中的 key
    dataIndex: "ChsName",
  },
  {
    title: "数量",
    dataIndex: "Qty",
  },
  {
    title: "面积",
    dataIndex: "SumProductArea",
  },
  {
    title: "面积(折5厘)",
    dataIndex: "SumConvertProductArea",
  },
];

export const OrderTotal = () => {
  // 订单统计数据
  interface OrderTotalListItem {
    ChsName: string;
    Qty: number;
    SumProductArea: number;
    SumConvertProductArea: number;
  }
  const orderTotalList = ref<OrderTotalListItem[]>([]);

  // 合计
  interface OrderTotalTotal {
    TotalNum: number;
    TotalQty: number;
    TotalArea: number;
    TotalConvertArea: number;
    TotalAmt: number;
    TotalPrePayAmt: number;
  }
  const orderTotalTotal = ref<OrderTotalTotal>({
    TotalNum: 0,
    TotalQty: 0,
    TotalArea: 0,
    TotalConvertArea: 0,
    TotalAmt: 0,
    TotalPrePayAmt: 0,
  });

  //#region 日期选择
  const orderTotalDateValue = ref<Moment>(moment());
  //#endregion

  //#region 获取 订单统计 数据
  // 是否在加载数据
  const orderTotalLoading = ref<boolean>(false);

  // 请求数据
  const getOrderTotalList = () => {
    // 正在加载数据
    orderTotalLoading.value = true;
    console.log(orderTotalDateValue.value.format("YYYY-MM-DD"));

    httpGet(alionErp.OrderTotal, { date: orderTotalDateValue.value.format("YYYY-MM-DD") })
      .then((res: any) => {
        console.log(res);
        if (res.meta.status == 200) {
          // 弹出提示
          message.success(res.meta.msg);
          orderTotalList.value = res.message.data;
          orderTotalTotal.value = res.message.total;
        } else {
          message.error(res.meta.msg);
        }

        // 数据加载完成
        orderTotalLoading.value = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  //#endregion

  return {
    orderTotalList,
    orderTotalTotal,
    orderTotalLoading,
    orderColumns,
    getOrderTotalList,
    orderTotalDateValue,
  };
};
