import { computed, ref, reactive, UnwrapRef } from "vue";
import { cloneDeep } from "lodash-es";
// 引入二次封装的 axios
import { httpGet, httpPost } from "../../utils/http";
// 引入请求接口
import { frameSmall, user } from "../../api";

import moment from "moment";
import { Moment } from "moment";

import { message } from "ant-design-vue";

// 玻璃架表头配置
const frameColumns = [
  {
    title: "ID",
    dataIndex: "frame_id",
  },
  {
    // 标题
    title: "玻璃架名称",
    // 数据中的 key
    dataIndex: "frame_name",
    slots: { customRender: "frame_name" },
  },
  {
    title: "使用单位",
    dataIndex: "user_name",
    slots: { customRender: "user_name" },
  },
  {
    title: "分区",
    dataIndex: "partition_name",
    slots: { customRender: "partition_name" },
  },
  {
    title: "放置位置X",
    dataIndex: "place_x",
    slots: { customRender: "place_x" },
  },
  {
    title: "放置位置Y",
    dataIndex: "place_y",
    slots: { customRender: "place_y" },
  },
  {
    title: "放置位置Z",
    dataIndex: "place_z",
    slots: { customRender: "place_z" },
  },
  {
    title: "当前状态",
    dataIndex: "is_states",
    slots: { customRender: "is_states" },
  },
  {
    title: "创建人",
    dataIndex: "create_user",
  },
  {
    title: "创建时间",
    dataIndex: "create_time",
  },
  {
    title: "更新人",
    dataIndex: "update_user",
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
  },
  {
    title: "操作",
    dataIndex: "frame_id",
    slots: { customRender: "operation" },
  },
];

export const Frame = () => {
  // 公司简称
  const company_mini_name = localStorage.getItem("company_mini_name");
  // 玻璃架数据
  interface FrameListItem {
    frame_id: number;
    frame_name: string;
    user_name: string;
    partition_name: string;
    place_x: number;
    place_y: number;
    place_z: number;
    create_user: string;
    create_time: string;
    update_time: string;
    update_user: string;
    is_states: number;
  }
  const frameList = ref<FrameListItem[]>([]);

  //#region 日期选择
  // 时间
  const frameDateValue = ref<Moment[]>([moment(), moment()]);
  let FrameDate = {
    startdate: moment().format("YYYY-MM-DD"),
    enddate: moment().format("YYYY-MM-DD"),
  };
  // 日期改变
  const onChangeDate = (value: Moment[], dateString: string[]) => {
    FrameDate = {
      startdate: value[0].format("YYYY-MM-DD"),
      enddate: value[1].format("YYYY-MM-DD"),
    };
  };
  //#endregion

  //#region 获取玻璃架数据
  // 是否在加载数据
  const frameLoading = ref<boolean>(false);

  // 请求数据
  const getFrameList = () => {
    // 正在加载数据
    frameLoading.value = true;

    httpGet(frameSmall.FrameSmallList, { companyid: localStorage.getItem("company_id") })
      .then((res: any) => {
        console.log(res);
        if (res.meta.status === 200) {
          // 弹出提示
          message.success(res.meta.msg);

          frameList.value = res.message.data;
        } else {
          message.error(res.meta.msg);
        }

        // 数据加载完成
        frameLoading.value = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  getFrameList();
  //#endregion

  //#region 条件搜索
  // 玻璃架状态
  const frameValue = ref<string>("all");
  // 使用单位名称
  const useValue = ref<string>("全部");
  // 使用单位列表
  const useList = ref<string[]>([]);
  const useListSearch = ref<string[]>([]);

  // 搜索结果列表
  const frameListSearch = computed(() => {
    const list: FrameListItem[] = [];
    // 公司简称
    const company_mini_name = localStorage.getItem("company_mini_name");

    // 清空使用单位列表
    useList.value = [];
    frameList.value.forEach((item: FrameListItem) => {
      // 保存使用单位名称
      if (useList.value.indexOf(item.user_name) === -1) {
        // useList.value.push(item.user_name);
        item.user_name === company_mini_name ? useList.value.unshift(item.user_name) : useList.value.push(item.user_name);
      }

      // 是否显示
      let isShow = false;

      // 是否显示已删除的
      if (item.is_states !== 0) isShow = true;

      // 补片状态筛选
      if (isShow) {
        // 默认不显示 条件满足再显示
        isShow = false;
        switch (frameValue.value) {
          // 正常
          case "normal":
            if (item.is_states === 1) isShow = true;
            break;
          // 报废
          case "scrap":
            if (item.is_states === 2) isShow = true;
            break;
          // 丢失
          case "lose":
            if (item.is_states === 3) isShow = true;
            break;
          default:
            isShow = true;
            break;
        }
      }

      // 客户名称筛选
      if (isShow) {
        // 默认不显示 条件满足再显示
        isShow = false;
        if (useValue.value === "全部" || useValue.value.length <= 0) isShow = true;
        if (item.user_name.indexOf(useValue.value) >= 0) isShow = true;
      }

      // 加入显示列表
      if (isShow) list.push(item);
    });

    // 更新使用单位列表
    useListSearch.value = useList.value;
    useListSearch.value.unshift("全部");

    return list;
  });

  // 文本框值变化时的回调
  const handleSearchClient = (value: string) => {
    useListSearch.value = ["全部"];
    useList.value.forEach(item => {
      if (item.indexOf(value) >= 0) {
        useListSearch.value.push(item);
      }
    });
  };
  //#endregion

  //#region 新增玻璃架
  // 对话框是否显示
  const newFrameVisible = ref<boolean>(false);
  // 等待
  const newFrameLoading = ref<boolean>(false);
  // 新增玻璃架名称
  const newFrameNameValue = ref<string>("");

  // 显示对话框
  const handleNewFrameVisible = () => {
    newFrameVisible.value = true;
  };
  // 确定
  const handleOkNewFrame = () => {
    console.log(newFrameNameValue.value);
    newFrameLoading.value = true;
    httpPost(frameSmall.AddFrameSmall, { framename: newFrameNameValue.value })
      .then((res: any) => {
        console.log(res);
        if (res.meta.status === 200) {
          // 弹出提示
          message.success(res.meta.msg);
        } else {
          message.error(res.meta.msg);
        }

        // 数据加载完成
        newFrameLoading.value = false;
        newFrameVisible.value = false;
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  // 取消
  const handleCancelNewFrame = () => {
    newFrameVisible.value = false;
  };
  //#endregion

  //#region 修改玻璃架名称
  const frameNameEditableData: UnwrapRef<Record<string, FrameListItem>> = reactive({});
  const frameNameEdit = (key: string) => {
    frameNameEditableData[key] = cloneDeep(frameListSearch.value.filter(item => key === item.frame_id.toString())[0]);
    // console.log("edit", key, frameNameEditableData[key]);
  };
  const frameNameSave = (key: string, oldValue: string) => {
    // console.log("修改后的Item", key, frameNameEditableData[key]);
    if (oldValue !== frameNameEditableData[key].frame_name) {
      frameLoading.value = true;
      httpPost(frameSmall.SetName, { frameid: frameNameEditableData[key].frame_id, framename: frameNameEditableData[key].frame_name })
        .then((res: any) => {
          console.log(res);
          if (res.meta.status === 200) {
            // 弹出提示
            message.success(res.meta.msg);
          } else {
            message.error(res.meta.msg);
          }

          // 数据加载完成
          frameLoading.value = false;
        })
        .catch((err: any) => {
          console.log(err);
        });
    }

    // 更新到页面
    Object.assign(frameListSearch.value.filter(item => key === item.frame_id.toString())[0], frameNameEditableData[key]);
    // 删除临时数据
    delete frameNameEditableData[key];
  };
  //#endregion

  //#region 借出玻璃架
  // 对话框是否显示
  const lendFrameVisible = ref<boolean>(false);
  // 可借出玻璃架列表
  const lendFrameList = computed(() => frameList.value.filter(item => item.is_states == 1 && item.user_name != company_mini_name));
  // 待借出玻璃架列表
  const lendFrameValue = ref<string[]>([]);
  // 客户列表
  interface UserListItem {
    user_id: number;
    user_name: string;
  }
  const userList = ref<UserListItem[]>([]);
  const userListSearch = ref<UserListItem[]>([]);
  // 当前客户
  const userValue = ref<number>();

  // 显示对话框
  const handleLendFrameVisible = () => {
    lendFrameVisible.value = true;
    // 获取客户列表
    httpGet(user.UserList)
      .then((res: any) => {
        console.log(res);
        if (res.meta.status === 200) {
          // 弹出提示
          message.success(res.meta.msg);

          userList.value = res.message.data;
          userListSearch.value = res.message.data;
        } else {
          message.error(res.meta.msg);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  // 文本框值变化时的回调
  const handleSearchUser = (value: string) => {
    console.log(value);
    userListSearch.value = [];
    userList.value.forEach(item => {
      if (item.user_name.indexOf(value) >= 0) {
        userListSearch.value.push(item);
      }
    });
  };

  // 玻璃架选择框发生改变
  const handleChangeLendFrame = (value: number[]) => {
    console.log(value, lendFrameValue);
  };

  // 表单校验
  const lendFrameFormRef = ref<string>("");
  // 表单数据接口
  interface FormState {
    name: string;
    password: string;
  }
  // 表单数据
  const lendFrameModel: UnwrapRef<FormState> = reactive({
    name: "",
    password: "",
  });
  // 账号校验规则
  // const validateName = async (rule: RuleObject, value: string) => {
  //   if (value === "") {
  //     return Promise.reject("手机号码不能为空");
  //   } else if (!validator.isMobilePhone(value, "zh-CN")) {
  //     return Promise.reject("请输入正确的手机号码");
  //   } else {
  //     return Promise.resolve();
  //   }
  // };
  // 表单验证规则
  const lendFrameRules = {
    // name: [{ validator: validateName, trigger: "change" }],
    // password: [{ validator: validatePassword, trigger: "change" }],
  };
  // 表单布局
  const lendFrameLayout = {
    wrapperCol: { span: 24 },
  };

  //#endregion

  return {
    company_mini_name,
    frameList,
    frameLoading,
    frameColumns,
    getFrameList,
    onChangeDate,
    frameDateValue,
    frameListSearch,
    frameValue,
    useValue,
    useListSearch,
    handleSearchClient,
    newFrameVisible,
    newFrameLoading,
    handleNewFrameVisible,
    handleOkNewFrame,
    handleCancelNewFrame,
    newFrameNameValue,
    frameNameEditableData,
    frameNameEdit,
    frameNameSave,
    lendFrameVisible,
    handleLendFrameVisible,
    lendFrameValue,
    handleChangeLendFrame,
    lendFrameFormRef,
    lendFrameModel,
    lendFrameRules,
    lendFrameLayout,
    userList,
    userListSearch,
    userValue,
    handleSearchUser,
    lendFrameList,
  };
};
