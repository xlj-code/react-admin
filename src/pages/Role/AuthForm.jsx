import React, { Fragment, useState } from "react";
import Proptypes from "prop-types";
import PubSub from "pubsub-js";
import { Input, Form, Tree } from "antd";
import menuList from "../../config/menuConfig";
const treeData = [{ title: "平台权限", key: "all", children: [...menuList] }];

export default function AuthForm(props) {
  const [checkedKeys, setCheckedKeys] = useState(props.role.menus);
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  React.useEffect(() => {
    PubSub.publish("checkedKeys", checkedKeys);
  }, [checkedKeys]);

  React.useEffect(() => {
    PubSub.subscribe("canceledCheckedKeys", (_, data) => {
      setCheckedKeys((checkedKeys) => (checkedKeys = data));
    });
    return () => {
      PubSub.unsubscribe("canceledCheckedKeys");
    };
  }, []);

  React.useEffect(() => {
    setCheckedKeys((checkedKeys) => (checkedKeys = props.role.menus));
  }, [props.role.menus]);

  return (
    <Fragment>
      <Form.Item label="角色名称">
        <Input value={props.role.name} disabled />
      </Form.Item>
      <Tree
        selectable={false}
        checkable
        defaultExpandAll
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </Fragment>
  );
}

AuthForm.prototype.propTypes = {
  role: Proptypes.object.isRequired,
};
