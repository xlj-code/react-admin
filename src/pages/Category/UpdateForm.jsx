import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";
import PubSub from "pubsub-js";

export default function UpdateForm(props) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    PubSub.publish("updateForm", form);
  }, [form]);

  const updateValue = (event) => {
    form.setFieldsValue(event.target.value);
  };

  return (
    <Fragment>
      <Form layout="vertical" form={form} name="updateForm" initialValues="">
        <Form.Item
          /*
被设置了 name 属性的 Form.Item 包装的控件，表单控件会自动添加 value（或 valuePropName 指定的其他属性） onChange（或 trigger 指定的其他属性），数据同步将被 Form 接管，这会导致以下结果：
你不再需要也不应该用 onChange 来做数据收集同步（你可以使用 Form 的 onValuesChange），但还是可以继续监听 onChange 事件。
你不能用控件的 value 或 defaultValue 等属性来设置表单域的值，默认值可以用 Form 里的 initialValues 来设置。注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。
你不应该用 setState，可以使用 form.setFieldsValue 来动态改变表单值。
 */
          name="updateFormItem"
          label={`分类名称：${props.categoryName}`}
          rules={[{ required: true, message: "想要修改的分类名称不能为空" }]}
          onChange={updateValue}
        >
          <Input
            name="categoryName"
            placeholder="请输入想要修改的分类名称"
            key={props.categoryName}
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
}

UpdateForm.prototype.propTypes = {
  categoryName: PropTypes.string.isRequired,
};
