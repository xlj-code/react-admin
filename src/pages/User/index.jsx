import React, { useState, useCallback } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import dayjs from "dayjs";
import PubSub from "pubsub-js";
import LinkButton from "../../components/LinkButton";
import AddUserForm from "./AddUserForm";
import UpdateUserForm from "./UpdateUserForm";
import { reqUsers, reqAddUser, reqDeleteUser, reqUpdateUser } from "../../api";

export default function User() {
  const [roles, setRoles] = useState([]);
  const [roleNames, setRoleNames] = useState();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading] = useState(false);
  const [modalVisible, setModalVisible] = useState(0);
  const [addUserForm, setAddUserForm] = useState({});
  const [updateUserForm, setUpdateUserForm] = useState({});

  const getUsers = useCallback(async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      setUsers((users) => (users = result.data.users));
      setRoles((roles) => (roles = result.data.roles));
    }
  }, []);

  const addUser = () => {
    addUserForm
      .validateFields()
      .then(async (values) => {
        const user = values;
        addUserForm.resetFields();
        const result = await reqAddUser(user);
        if (result.status === 0) {
          message.success("添加用户成功");
          setModalVisible((modalVisible) => (modalVisible = 0));
          getUsers();
        } else {
          message.error("添加用户失败");
        }
      })
      .catch((errorInfo) => {
        message.error(errorInfo);
      });
  };
  React.useEffect(() => {
    PubSub.subscribe("addUserForm", (_, data) => {
      setAddUserForm((addUserForm) => (addUserForm = data));
    });
    PubSub.subscribe("updateUserForm", (_, data) => {
      setUpdateUserForm((updateUserForm) => (updateUserForm = data));
    });
    return () => {
      PubSub.unsubscribe("addUserForm");
      PubSub.unsubscribe("updateUserForm");
    };
  });

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  React.useEffect(() => {
    initRoleNames(roles);
  }, [roles]);

  const handleCancel = () => {
    setModalVisible((modalVisible) => (modalVisible = false));
    Object.keys(addUserForm).length !== 0 && addUserForm.resetFields();
    Object.keys(updateUserForm).length !== 0 && updateUserForm.resetFields();
  };

  const initRoleNames = (roles) => {
    const roleNamesObj = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    setRoleNames((roleNames) => (roleNames = roleNamesObj));
  };

  const deleteUser = async (user) => {
    const result = await reqDeleteUser(user._id);
    if (result.status === 0) {
      message.success("删除用户成功");
      getUsers();
    } else {
      message.error("删除用户失败");
    }
  };

  const getCurrentUser = (currentUser) => {
    setUser((user) => (user = currentUser));
  };
  const updateUser = async () => {
    updateUserForm.validateFields().then(async (values) => {
      const cUser = values;
      cUser._id = user._id;
      updateUserForm.resetFields();
      const result = await reqUpdateUser(cUser);
      if (result.status === 0) {
        message.success("修改用户成功");
        setModalVisible((modalVisible) => (modalVisible = 0));
        getUsers();
      } else {
        message.error("修改用户失败");
      }
    });
  };
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "注册时间",
      dataIndex: "create_time",
      render: (create_time) => dayjs(create_time).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "所属角色",
      dataIndex: "role_id",
      // render: (role_id) => roles.find((role) => role._id === role_id).name,
      render: (role_id) => roleNames[role_id],
    },
    {
      title: "操作",
      render: (user) => (
        <span>
          <LinkButton
            onClick={() => {
              getCurrentUser(user);
              setModalVisible((modalVisible) => (modalVisible = 2));
            }}
          >
            修改
          </LinkButton>
          <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
        </span>
      ),
    },
  ];
  return (
    <Card
      title={
        <Button
          type="primary"
          onClick={() => setModalVisible((modalVisible) => (modalVisible = 1))}
        >
          创建用户
        </Button>
      }
    >
      <Table
        dataSource={users}
        columns={columns}
        bordered
        rowKey="_id"
        pagination={{ defaultPageSize: 5 }}
        loading={loading}
      />
      <Modal
        title="创建用户"
        visible={modalVisible === 1}
        onOk={addUser}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <AddUserForm roles={roles} />
      </Modal>
      <Modal
        title="修改用户"
        visible={modalVisible === 2}
        onOk={updateUser}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <UpdateUserForm roles={roles} user={user} />
      </Modal>
    </Card>
  );
}
