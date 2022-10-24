import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Select } from "antd";
import PubSub from "pubsub-js";

export default function UpdateUserForm(props) {
  const [form] = Form.useForm();
  React.useEffect(() => {
    PubSub.publish("updateUserForm", form);
  }, [form]);

  return (
    <Form
      form={form}
      initialValues={{
        username: props.user.username,
        phone: props.user.phone,
        email: props.user.email,
        role_id: props.user.role_id,
      }}
    >
      <Form.Item
        name="username"
        label="用户名"
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
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "手机号不能为空",
          },
        ]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "邮箱不能为空",
          },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="role_id"
        label="角色"
        rules={[
          {
            required: true,
            whitespace: true,
            message: "角色不能为空",
          },
        ]}
      >
        <Select placeholder="请选择角色">
          {props.roles.map((role) => {
            return (
              <Select.Option value={role._id} key={role._id}>
                {role.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
}

UpdateUserForm.prototype.propTypes = {
  roles: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};
