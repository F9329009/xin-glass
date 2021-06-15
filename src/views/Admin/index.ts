import { ref } from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { publicApi } from "../../api";
// 引入 router 路由
import router from "../../router";

export const Admin = () => {
  // 公司名称
  const companyName = localStorage.getItem("company_name");

  // 标签页列表数据类型
  type tabsListType = {
    title: string;
    content: string;
    key: string;
    url_name: string;
  };
  // 标签页列表
  const tabsList = ref<tabsListType[]>([]);
  // 当前标签
  const activeKeyTabs = ref<string>("");
  // 侧边栏列表
  interface navListItem {
    menu_id: number;
    menu_name: string;
    permission_id: number;
    parent_id: number;
    parent_url: string | null;
    url: string;
    url_name: string;
    sort: number;
    children: [];
  }
  const navList = ref<navListItem[]>([]);
  // 导航 id 与 url 对应表
  type menuListType = {
    id: number;
    parent_id: number;
    parent_url: string | null;
    url: string;
    url_name: string;
  };
  const menuList: menuListType[] = [];
  // 当前侧边栏展开的 SubMenu
  const openKeys = ref<number[]>([]);
  // 当前侧边栏当前选中 key
  const selectedKeys = ref<number[]>([]);

  //#region 获取 侧边栏 数据
  const getNavList = () => {
    httpGet(publicApi.NavList)
      .then((res: any) => {
        console.log(res);
        if (res.meta.status == 200) {
          navList.value = res.message.list;
          if (tabsList.value.length <= 0) {
            // 添加默认标签页
            tabsList.value.push({
              title: res.message.list[0].menu_name,
              content: ``,
              key: res.message.list[0].url,
              url_name: res.message.list[0].url_name,
            });

            // 递归遍历导航列表查找符合当前路径的对象添加到标签页
            const recursive = (arr: navListItem[], item: string) => {
              for (let i = 0; i < arr.length; i++) {
                menuList.push({
                  id: arr[i].menu_id,
                  url: arr[i].url,
                  url_name: arr[i].url_name,
                  parent_id: arr[i].parent_id ? arr[i].parent_id : -1,
                  parent_url: arr[i].parent_url ? arr[i].parent_url : "",
                });
                // 找到对应的路径
                if (arr[i].url === item) {
                  // 判断标签是否存在
                  if (tabsList.value.findIndex(item1 => item1.key === item) === -1) {
                    // 增加一个标签页
                    tabsList.value.push({
                      title: arr[i].menu_name,
                      content: ``,
                      key: item,
                      url_name: arr[i].url_name,
                    });
                  }
                  // 当前标签页
                  activeKeyTabs.value = item;
                  return;
                }

                if (arr[i].children.length > 0) recursive(arr[i].children, item);
              }
            };
            recursive(res.message.list, location.pathname);

            if (tabsList.value.length <= 1) router.push({ path: "/admin" });

            // 当前项目
            const menu = menuList[menuList.findIndex(item => item.url === location.pathname)];
            // 如果有父级目录则展开父级目录
            if (openKeys.value.indexOf(menu.parent_id!) === -1) openKeys.value.push(menu.parent_id!);

            // 侧边栏默认选中 key
            selectedKeys.value = [menu.id];
          }

          console.log(menuList);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  getNavList();
  //#endregion

  //#region 退出登录
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("company_name");
    localStorage.removeItem("company_mini_name");
    router.push({ path: "/" });
  };
  //#endregion

  //#region 标签页
  // 切换标签页
  const changeTabs = (activeKey: string) => {
    // 当前项目
    const menu: menuListType = menuList[menuList.findIndex(item => item.url === activeKey)];
    // 如果有父级目录则展开父级目录
    if (openKeys.value.indexOf(menu.parent_id!) === -1) openKeys.value.push(menu.parent_id!);

    // 选中侧边栏当前 key
    selectedKeys.value = [menu.id];

    // 添加标签页
    // router.push({ path: activeKey });
    console.log(activeKey);

    activeKeyTabs.value = activeKey;
  };
  // 添加标签页
  const addTabs = (payload: any) => {
    // 判断此标签页是否存在
    const index = tabsList.value.findIndex(item => item.key === payload.url);
    if (index >= 0) {
      activeKeyTabs.value = tabsList.value[index].key;
    } else {
      tabsList.value.push({
        title: payload.menu_name,
        content: ``,
        key: payload.url,
        url_name: payload.url_name,
      });
      // 跳转的此标签页
      activeKeyTabs.value = payload.url;
    }
  };
  // 删除标签页
  const removeTabs = (targetKey: string) => {
    let lastIndex = 0;
    tabsList.value.forEach((panesList, i) => {
      if (panesList.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    tabsList.value = tabsList.value.filter(pane => pane.key !== targetKey);
    if (tabsList.value.length && activeKeyTabs.value === targetKey) {
      if (lastIndex >= 0) {
        activeKeyTabs.value = tabsList.value[lastIndex].key;
      } else {
        activeKeyTabs.value = tabsList.value[0].key;
      }
    }
    // 跳转
    return router.push({ path: tabsList.value[lastIndex].key });
  };
  // 点击标签页按钮
  const onEditTabs = (targetKey: string) => {
    // 删除标签
    removeTabs(targetKey);
  };
  //#endregion

  return {
    companyName,
    openKeys,
    selectedKeys,
    collapsed: ref<boolean>(false),
    navList,
    handleLogout,
    // 标签页
    tabsList,
    activeKeyTabs,
    onEditTabs,
    addTabs,
    changeTabs,
  };
};
