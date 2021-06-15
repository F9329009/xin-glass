import { computed, ref } from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { alionErp } from "../../api";

import moment from "moment";
import { Moment } from "moment";

import { message } from "ant-design-vue";

export const Patch = () => {
  // 补片数据
  interface patchListItem {
    id: number;
    ApproveDate: string;
    Approver: string;
    FRWIPName: string;
    FinishQty: number;
    FrWIP: string;
    ItemLength: number;
    ItemWidth: number;
    NetRouteCode: string;
    PCNO: string;
    Qty: number;
    Remark: string;
    RouteCode: string;
    RouteStr: string;
    SONO: string;
    SOSeqNo: 7;
    StartQty: 0;
    ToWIPName: string;
    WIPCode: string;
    custbrief: string;
    frWTName: string;
    itemname: string;
    log_FRWIPName: string;
    log_FrWIP: string;
    log_ToWIP: string;
    log_ToWIPName: string;
    log_approvedate: string;
    toWTName: string;
    type: string;
    typename: string;
    workcontent: string;
  }
  const patchList = ref<patchListItem[]>([]);

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
  // 请求数据
  const getPatchList = () => {
    // 清空补片状态
    stateValue.value = "all";
    clientValue.value = "全部";

    httpGet(alionErp.Patch, patchDate)
      .then((res: any) => {
        console.log(res);
        if (res.meta.status === 200) {
          // 弹出提示
          message.success(res.meta.msg);

          // 客户名称搜索框
          clientListSearch.value = ["全部"];
          res.message.data.forEach((item: patchListItem) => {
            if (clientListSearch.value.indexOf(item.custbrief) === -1) clientListSearch.value.push(item.custbrief);
          });

          patchList.value = res.message.data;
        } else {
          message.error(res.meta.msg);
        }
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

  // 补片搜索结果列表
  const patchListSearch = computed(() => {
    const list: patchListItem[] = [];

    // 清空客户列表
    clientList.value = [];
    patchList.value.forEach((item: patchListItem) => {
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

    // 更新客户列表
    clientListSearch.value = clientList.value;
    clientListSearch.value.unshift("全部");

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
    patchList,
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
