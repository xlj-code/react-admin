import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Select, Input } from "antd";
import PubSub from "pubsub-js";

export default function AddForm(props) {
  const [form] = Form.useForm();

  /*
  如果在Modal组件中使用Form组件产生如下报错Warning: Instance created by `useForm` is not connected to any Form element.
  */
  React.useEffect(() => {
    PubSub.publish("addForm", form);
  }, [form]);

  const addValue = (event) => {
    form.setFieldsValue("addInput", event.target.value);
  };

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ select: props.parentId, addInput: "" }}
      >
        <Form.Item label="所属分类：" name="select">
          <Select>
            <Select.Option value="0">一级分类</Select.Option>
            {props.categorys.map((category) => {
              return (
                <Select.Option value={category._id} key={category._id}>
                  {category.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="分类名称："
          name="addInput"
          onChange={addValue}
          rules={[{ required: true, message: "想要修改的分类名称不能为空" }]}
        >
          <Input placeholder="请输入想要添加的分类名称" />
        </Form.Item>
      </Form>
    </Fragment>
  );
}

AddForm.prototype.propTypes = {
  categorys: PropTypes.array.isRequired,
  parentId: PropTypes.string.isRequired,
};
