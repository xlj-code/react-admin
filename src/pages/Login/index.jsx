import React from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import logo from "../../assets/images/logo192.png";
import "./login.less";

export default function Login() {
  const navigator = useNavigate();
  const user = memoryUtils.user;

  React.useEffect(() => {
    if (user && user._id) {
      navigator("/admin");
    }
  }, [navigator, user, user._id]);

  const checkPassword = (rule, value) => {
    if (!value) {
      return Promise.reject("密码不能为空");
    } else if (value.length < 4) {
      return Promise.reject("密码长度不能小于4位");
    } else if (value.length > 16) {
      return Promise.reject("密码长度不能大于16位");
    } else if (/\s+/.test(value)) {
      return Promise.reject("密码不能含有空格");
    } else {
      return Promise.resolve();
    }
  };

  const onFinish = async (values) => {
    const { username, password } = values;

    const result = await reqLogin(username, password);
    if (result.status === 0) {
      message.success("登录成功");
      let user = result.data;
      memoryUtils.user = user;
      storageUtils.saveUser(user);
      navigator("/admin", { replace: true });
    } else {
      message.error(result.msg);
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo" />
        <h1>后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            hasFeedback
            rules={[
              {
                required: true,
                whitespace: true,
                message: "用户名不能为空",
              },
              { min: 4, message: "用户名至少4位" },
              { max: 12, message: "用户名最多12位" },
              {
                pattern: /^[a-zA-z0-9\u4e00-\u9fa5]+$/,
                message: "用户名必须是中文或数字或英文",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
}
