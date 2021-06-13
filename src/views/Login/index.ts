import { computed, reactive, ref, UnwrapRef } from "vue";
// 引入二次封装的 axios
import { httpPost } from "../../utils/http";
// 引入请求接口
import { user } from "../../api";
// 引入 router 路由
import router from "../../router";
// 引入 validator 校验器
import validator from "validator";

import { RuleObject } from "ant-design-vue/es/form/interface";
import { message } from "ant-design-vue";

export const Login = () => {
  //#region 自动登录
  const checkedAutoLogin = ref<boolean>(localStorage.getItem("AutoLogin") === "1" ? true : false);

  if (checkedAutoLogin.value) {
    // 获取 token 令牌
    const token = localStorage.getItem("token");
    // 判断是否有 token 令牌
    if (token) {
      router.push({ path: "/admin" });
    }
  }
  //#endregion

  //#region 自动登录切换
  const handleIsAutoLogin = () => {
    localStorage.setItem("AutoLogin", checkedAutoLogin.value ? "1" : "0");
  };
  //#endregion

  //#region 表单校验
  const loginFormRef = ref<string>("");
  // 表单数据接口
  interface FormState {
    name: string;
    password: string;
  }
  // 表单数据
  const loginModel: UnwrapRef<FormState> = reactive({
    name: "",
    password: "",
  });
  // 账号校验规则
  const validateName = async (rule: RuleObject, value: string) => {
    if (value === "") {
      return Promise.reject("手机号码不能为空");
    } else if (!validator.isMobilePhone(value, "zh-CN")) {
      return Promise.reject("请输入正确的手机号码");
    } else {
      return Promise.resolve();
    }
  };
  // 密码校验规则
  const validatePassword = async (rule: RuleObject, value: string) => {
    // 密码校验规则
    const passwordOptions = {
      minLength: 8, // 最小长度
      minLowercase: 1, // 最少需要小写字母
      minUppercase: 0, // 最少需要大写字母
      minNumbers: 1, // 最少需要数字
      minSymbols: 0, // 最少需要符号
      returnScore: false, // 是否返回分数
    };

    if (value === "") {
      return Promise.reject("密码不能为空");
    } else if (!validator.isStrongPassword(value, passwordOptions)) {
      return Promise.reject("密码长度≥8且英文字母≥1");
    } else {
      return Promise.resolve();
    }
  };

  // 表单验证规则
  const loginRules = {
    name: [{ validator: validateName, trigger: "change" }],
    password: [{ validator: validatePassword, trigger: "change" }],
  };
  // 表单布局
  const layout = {
    wrapperCol: { span: 24 },
  };
  //#endregion

  //#region 发送登录请求
  const handleLogin = (values: FormState) => {
    console.log(values, loginModel);
    // 发送请求
    httpPost(user.Login, {
      phone: values.name,
      password: values.password,
    })
      .then((res: any) => {
        // 请求成功
        console.log(res);
        if (res.meta.status == 200) {
          // 弹出提示
          message.success(res.meta.msg);
          // 保存 token
          localStorage.setItem("token", res.message.token);
          // 保存公司名称和公司简称
          localStorage.setItem("company_id", res.message.company_id);
          localStorage.setItem("company_name", res.message.company_name);
          localStorage.setItem("company_mini_name", res.message.company_mini_name);

          // 取出重定向路径
          if (location.search.length > 0) {
            const searchData = new URLSearchParams(location.search);
            const redirect = searchData.get("redirect");

            // 判断是否需要重定向
            if (redirect) {
              return router.push({ path: redirect });
            }
          }

          // 没有重定向路径默认跳转到后台首页
          router.push({ path: "/admin" });
        } else {
          message.error(res.meta.msg);
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  //#endregion

  // 返回
  return {
    checkedAutoLogin,
    loginModel,
    loginFormRef,
    loginRules,
    layout,
    handleLogin,
    handleIsAutoLogin,
  };
};
