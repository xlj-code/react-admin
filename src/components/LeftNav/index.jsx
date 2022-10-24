import React, { useState } from "react";
import "./index.less";
import logo from "../../assets/images/logo192.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import memoryUtils from "../../utils/memoryUtils";
import {
  AppstoreOutlined,
  PieChartOutlined,
  HomeOutlined,
  BarsOutlined,
  ToolOutlined,
  SafetyOutlined,
  UserAddOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("首页", "/home", <HomeOutlined />),
  getItem("商品", "/products", <AppstoreOutlined />, [
    getItem("品类管理", "/products/category", <BarsOutlined />),
    getItem("商品管理", "/products/product", <ToolOutlined />),
  ]),
  getItem("用户管理", "/user", <UserAddOutlined />),
  getItem("角色管理", "/role", <SafetyOutlined />),
  getItem("图形图表", "/charts", <AreaChartOutlined />, [
    getItem("柱形图", "/charts/bar", <BarChartOutlined />),
    getItem("折线图", "/charts/line", <LineChartOutlined />),
    getItem("饼图", "/charts/pie", <PieChartOutlined />),
  ]),
];
export default function LeftNav() {
  const navgiator = useNavigate();
  const location = useLocation();
  const [itemsList, setItemsList] = useState(items);
  React.useEffect(() => {
    /*
  判断当前登陆用户对item是否有权限
   */
    const result = items.map((item) => {
      const menus = memoryUtils.user.role.menus;
      const username = memoryUtils.user.username;
      if (username === "admin") {
        return true;
      } else if (!item.children) {
        return menus.find((item2) => {
          return item2 === item.key;
        });
      } else if (item.children) {
        return item.children.some((item3) => {
          return menus.indexOf(item3.key) !== -1;
        });
      }
      return false;
    });
    const r = items.map((item, index) => {
      return (
        (result[index] === true || typeof result[index] === "string") && item
      );
    });
    setItemsList((itemsList) => (itemsList = r));
  }, []);

  const jump = (items) => {
    navgiator(items.key.slice(1));
    PubSub.publish("title", items.domEvent.target.innerHTML);
  };
  return (
    <nav className="left-nav">
      <Link className="left-nav-header" to="home">
        <img src={logo} alt="logo" />

        <h1>后台</h1>
      </Link>
      <Menu
        //自动选择当前菜单项
        selectedKeys={[
          location.pathname.slice(6),
          location.pathname.slice(6, 23),
        ]}
        //自动选择打开当前子菜单
        defaultOpenKeys={["/" + location.pathname.split("/")[2]]}
        mode="inline"
        theme="dark"
        collapsed="false"
        items={itemsList}
        onClick={jump}
      />
    </nav>
  );
}
