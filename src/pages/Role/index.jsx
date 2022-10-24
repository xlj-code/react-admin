import React, { useState } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import PubSub from "pubsub-js";
import dayjs from "dayjs";
import AddForm from "./AddForm";
import AuthForm from "./AuthForm";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import "./index.less";
import memoryUtils from "../../utils/memoryUtils";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState({});
  const [loading] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(0);
  const [addForm, setAddForm] = useState({});
  const [checkedKeys, setCheckedKeys] = useState([]);
  const getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      setRoles((roles) => (roles = result.data));
    }
  };

  const addRole = () => {
    addForm
      .validateFields()
      .then(async (values) => {
        const { roleName } = values;
        addForm.resetFields();
        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功");
          setRoles((roles) => [...roles, result.data]);
          setModalVisible((modalVisible) => (modalVisible = 0));
        } else {
          message.error("添加角色失败");
        }
      })
      .catch((errorInfo) => {
        Promise.reject(errorInfo);
      });
  };

  const updateRole = async () => {
    role.menus = [...checkedKeys];
    role.auth_name = memoryUtils.user.username;
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      message.success("设置角色权限成功");
      setModalVisible((modalVisible) => (modalVisible = 0));
      getRoles();
    } else {
      message.error("设置角色权限失败");
    }
  };

  const handleCancel = () => {
    setModalVisible((modalVisible) => (modalVisible = 0));
    JSON.stringify(addForm) !== "{}" && addForm.resetFields();
    /*
      取消后保存了无效修改，修改的与之前的比对，将之前的用PubSub或props传回去，
      这样再次点击设置角色权限按钮就不会保存之前的修改却没点确定的内容
    */
    if (checkedKeys !== role.menus) {
      setCheckedKeys((checkedKeys) => (checkedKeys = role.menus));
    }
  };

  React.useEffect(() => {
    PubSub.publish("canceledCheckedKeys", checkedKeys);
  }, [checkedKeys]);

  React.useEffect(() => {
    getRoles();
    PubSub.subscribe("addRoleForm", (_, data) => {
      setAddForm((addForm) => (addForm = data));
    });
    PubSub.subscribe("checkedKeys", (_, data) => {
      setCheckedKeys((checkedKeys) => (checkedKeys = data));
    });
    return () => {
      PubSub.unsubscribe("addRoleForm");
      PubSub.unsubscribe("checkedKeys");
    };
  }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState([role._id]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onSelect = (record) => {
    setRole((role) => (role = record));
  };
  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: onSelect,
  };

  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: (create_time) => dayjs(create_time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
      render: (auth_time) => dayjs(auth_time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "授权人",
      dataIndex: "auth_name",
    },
  ];

  return (
    <Card
      title={
        <span>
          <Button
            type="primary"
            className="title-button"
            onClick={() => {
              setModalVisible((modalVisible) => (modalVisible = 1));
            }}
          >
            创建角色
          </Button>
          <Button
            type="primary"
            className="title-button"
            disabled={!role._id}
            onClick={() => {
              setModalVisible((modalVisible) => (modalVisible = 2));
            }}
          >
            设置角色权限
          </Button>
        </span>
      }
    >
      <Table
        dataSource={roles}
        columns={columns}
        bordered
        rowKey="_id"
        loading={loading}
        pagination={{ defaultPageSize: 5 }}
        rowSelection={rowSelection}
      />
      <Modal
        title="添加角色"
        visible={modalVisible === 1}
        onOk={addRole}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <AddForm />
      </Modal>
      <Modal
        title="设置角色权限"
        visible={modalVisible === 2}
        onOk={updateRole}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <AuthForm role={role} />
      </Modal>
    </Card>
  );
}
