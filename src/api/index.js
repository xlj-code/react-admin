import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";

export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

export const reqCategorys = (parentId) =>
  ajax("/manage/category/list", { parentId });

export const reqAddCategory = ({ categoryName, parentId }) =>
  ajax("/manage/category/add", { categoryName, parentId }, "POST");

export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax("/manage/category/update", { categoryId, categoryName }, "POST");

export const reqAddUser = (user) => ajax("/manage/user/add", user, "POST");

export const reqProducts = (pageNum, pageSize) =>
  ajax("/manage/product/list", { pageNum, pageSize });

export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax("/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

export const reqCategory = (categoryId) =>
  ajax("/manage/category/info", { categoryId });

export const reqUpdateStatus = (productId, status) =>
  ajax("/manage/product/updateStatus", { productId, status }, "POST");

export const reqDeleteImg = (name) =>
  ajax("/manage/img/delete", { name }, "POST");

export const reqAddOrUpdateProduct = (product) =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

export const reqRoles = () => ajax("/manage/role/list");

export const reqAddRole = (roleName) =>
  ajax("/manage/role/add", { roleName }, "POST");

export const reqUpdateRole = (role) =>
  ajax("/manage/role/update", role, "POST");

export const reqUsers = () => ajax("/manage/user/list");

export const reqUpdateUser = (user) =>
  ajax("/manage/user/update", user, "POST");

export const reqDeleteUser = (userId) =>
  ajax("/manage/user/delete", { userId }, "POST");

export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=832d90c5997789a4e6ddc8a46a222288&city=${city}&output=JSON`;
    jsonp(url, { timeout: 5000 }, (err, data) => {
      if (!err & (data.status === "1")) {
        const { weather } = data.lives[0];
        resolve(weather);
      } else {
        message.error("获取天气信息失败");
        reject("获取天气信息失败");
      }
    });
  });
};
/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */
