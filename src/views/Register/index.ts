// import {} from "vue";
// 引入二次封装的 axios
import { httpGet } from "../../utils/http";
// 引入请求接口
import { publicApi } from "../../api";

export const Register = () => {
  const getTest = () => {
    httpGet(publicApi.ProductionReport, {
      startdate: "2021-04-02",
      enddate: "2021-04-03",
    })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  // 返回
  return {
    getTest,
  };
};
