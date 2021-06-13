import { ref } from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { alionErp } from "../../api";

import moment from "moment";
import { Moment } from "moment";

import { message } from "ant-design-vue";

// 各班组表头配置
const groupColumns = [
  {
    title: "工序",
    dataIndex: "WIPName",
  },
  {
    // 标题
    title: "班组",
    // 数据中的 key
    dataIndex: "WTName",
  },
  {
    title: "包料产量",
    dataIndex: "ProductArea",
  },
  {
    title: "包料产量(折5厘)",
    dataIndex: "ConvertProductArea",
  },
  {
    title: "来料产量",
    dataIndex: "ProductArea_LB",
  },
  {
    title: "来料产量(折5厘)",
    dataIndex: "ConvertProductArea_LB",
  },
  {
    title: "合计产量",
    dataIndex: "SumProductArea",
  },
  {
    title: "合计产量(折5厘)",
    dataIndex: "SumConvertProductArea",
  },
  {
    title: "成品率",
    dataIndex: "ProductRate",
  },
  {
    title: "成品率(折5厘)",
    dataIndex: "ConvertProductRate",
  },
  {
    title: "破损量",
    dataIndex: "DamageArea",
  },
  {
    title: "破损量(折5厘)",
    dataIndex: "ConvertDamageArea",
  },
];

// 各工序统计表头配置
const processColumns = [
  {
    title: "工序",
    dataIndex: "WIPName",
  },
  {
    title: "包料产量",
    dataIndex: "ProductArea",
  },
  {
    title: "包料产量(折5厘)",
    dataIndex: "ConvertProductArea",
  },
  {
    title: "来料产量",
    dataIndex: "ProductArea_LB",
  },
  {
    title: "来料产量(折5厘)",
    dataIndex: "ConvertProductArea_LB",
  },
  {
    title: "合计产量",
    dataIndex: "SumProductArea",
  },
  {
    title: "合计产量(折5厘)",
    dataIndex: "SumConvertProductArea",
  },
  {
    title: "成品率",
    dataIndex: "ProductRate",
  },
  {
    title: "成品率(折5厘)",
    dataIndex: "ConvertProductRate",
  },
  {
    title: "破损量",
    dataIndex: "DamageArea",
  },
  {
    title: "破损量(折5厘)",
    dataIndex: "ConvertDamageArea",
  },
];

export const ProductionReport = () => {
  // 各班级数据
  const productionReportList = ref([]);
  // 各班组统计
  const productionReportGroupTotal = ref([]);
  // 合计
  const productionReportAllTotal = ref({});

  //#region 日期选择
  // 时间
  const reportDateValue = ref<Moment[]>([moment(), moment()]);
  let reportDate = {
    startdate: moment().format("YYYY-MM-DD"),
    enddate: moment().format("YYYY-MM-DD"),
  };
  // 日期改变
  const onChangeDate = (value: Moment[], dateString: string[]) => {
    reportDate = {
      startdate: value[0].format("YYYY-MM-DD"),
      enddate: value[1].format("YYYY-MM-DD"),
    };
  };
  //#endregion

  //#region 获取 生产报表 数据
  // 是否在加载数据
  const groupLoading = ref<boolean>(false);
  const processLoading = ref<boolean>(false);

  // 请求数据
  const getProductionReportList = () => {
    // 正在加载数据
    groupLoading.value = true;
    processLoading.value = true;

    httpGet(alionErp.ProductionReport, reportDate)
      .then((res: any) => {
        console.log(res);
        if (res.meta.status == 200) {
          // 弹出提示
          message.success(res.meta.msg);
          productionReportList.value = res.message.data;
          productionReportGroupTotal.value = res.message.total.subTotal;
          productionReportAllTotal.value = res.message.total.all;
        } else {
          message.error(res.meta.msg);
        }

        // 数据加载完成
        groupLoading.value = false;
        processLoading.value = false;

        console.log(productionReportList.value);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  //#endregion

  return {
    productionReportList,
    productionReportGroupTotal,
    productionReportAllTotal,
    groupLoading,
    processLoading,
    groupColumns,
    processColumns,
    getProductionReportList,
    onChangeDate,
    reportDateValue,
  };
};
