import React from "react";
// import PropTypes from "prop-types";
import { Form, Input } from "antd";
import PubSub from "pubsub-js";

export default function AddForm() {
  const [form] = Form.useForm();
  /*
  如果在Modal组件中使用Form组件产生如下报错Warning: Instance created by `useForm` is not connected to any Form element.
  */
  React.useEffect(() => {
    PubSub.publish("addRoleForm", form);
  }, [form]);

  const addValue = (event) => {
    form.setFieldsValue("addInput", event.target.value);
  };

  return (
    <Form form={form} initialValues={{ addInput: "" }}>
      <Form.Item
        label="角色名称："
        name="roleName"
        onChange={addValue}
        rules={[{ required: true, message: "想要修改的角色称不能为空" }]}
      >
        <Input placeholder="请输入想要添加的角色名称" />
      </Form.Item>
    </Form>
  );
}
