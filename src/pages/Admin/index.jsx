import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import Header from "../../components/Header";
import LeftNav from "../../components/LeftNav";
import memoryUtils from "../../utils/memoryUtils";
import "./admin.less";

const { Footer, Sider, Content } = Layout;
export default function Admin() {
  const navigator = useNavigate();
  const user = memoryUtils.user;
  React.useEffect(() => {
    if (!user || !user._id) {
      navigator("/login");
    }
  }, [navigator, user, user._id]);
  return (
    <Layout className="Layout">
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content className="Content">
          <Outlet />
        </Content>
        <Footer className="Footer">推荐使用谷歌或者Edge浏览器</Footer>
      </Layout>
    </Layout>
  );
}
