import React, { Fragment, useCallback } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import PubSub from "pubsub-js";
import LinkButton from "../../components/LinkButton";
import AddForm from "./AddForm";
import UpdateForm from "./UpdateForm";
import { reqAddCategory, reqCategorys, reqUpdateCategory } from "../../api";
import "./index.less";

export default function Category() {
  const [loading, setLoading] = React.useState(false);
  const [title] = React.useState("一级分类列表");
  const [category, setCategory] = React.useState({});
  const [categorys, setCategorys] = React.useState([]);
  const [parentId, setParentId] = React.useState("0");
  const [parentName, setParentName] = React.useState("");
  const [subcategorys, setSubcategorys] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(0);
  const [updateForm, setUpdateForm] = React.useState({});
  const [addForm, setAddForm] = React.useState({});
  const getCategorys = useCallback(
    async (currentChangeParentId) => {
      setLoading((loading) => (loading = true));
      const result = await reqCategorys(currentChangeParentId || parentId);
      setLoading((loading) => (loading = false));
      if (result.status === 0) {
        if (parentId === "0") {
          setCategorys((categorys) => (categorys = result.data));
        } else {
          setSubcategorys((subcategorys) => (subcategorys = result.data));
        }
      } else {
        message.error("获取分类列表失败");
      }
    },
    [parentId]
  );
  const showCategorys = () => {
    setParentId((parentId) => (parentId = "0"));
    setParentName((parentName) => (parentName = ""));
    setSubcategorys((subcategorys) => (subcategorys = []));
  };

  const showSubcategorys = (category) => {
    return () => {
      setParentId((parentId) => (parentId = category._id));
      setParentName((parentName) => (parentName = category.name));
    };
  };

  const addCategory = () => {
    addForm.validateFields().then(async (values) => {
      setModalVisible((modalVisible) => (modalVisible = 0));
      const categoryName = values.addInput;
      const currentChangeParentId = values.select;
      addForm.resetFields();
      const result = await reqAddCategory({
        categoryName,
        parentId: currentChangeParentId,
      });
      if (result.status === 0) {
        if (
          currentChangeParentId === parentId ||
          currentChangeParentId === "0"
        ) {
          /*传0
        当在二级列表添加一级列表的信息时,只更新一级列表信息，但不渲染页面
        当在一级列表添加二级列表的信息时,只更新二级列表信息，但不渲染页面
        */
          getCategorys(0);
        }
        message.success("添加成功");
      }
    });
  };
  const showUpdate = (c) => {
    return () => {
      setCategory((category) => (category = c));
      setModalVisible((modalVisible) => (modalVisible = 2));
    };
  };

  const updateCategory = () => {
    updateForm
      .validateFields()
      .then(async (values) => {
        setModalVisible((modalVisible) => (modalVisible = 0));
        const categoryId = category._id;
        const categoryName = values.updateFormItem;
        updateForm.resetFields();
        const result = await reqUpdateCategory({ categoryId, categoryName });
        if (result.status === 0) {
          getCategorys();
          message.success("修改成功");
        } else {
          message.error("修改失败");
        }
      })
      .catch((errorInfo) => {
        Promise.reject(errorInfo);
      });
  };

  const handleCancel = (form) => {
    return () => {
      setModalVisible((modalVisible) => (modalVisible = 0));
      form.resetFields();
    };
  };

  React.useEffect(() => {
    getCategorys();
  }, [getCategorys]);

  React.useEffect(() => {
    PubSub.subscribe("addForm", (_, data) => {
      setAddForm((addForm) => (addForm = data));
    });
    PubSub.subscribe("updateForm", (_, data) => {
      setUpdateForm((updateForm) => (updateForm = data));
    });

    return () => {
      PubSub.unsubscribe("addForm");
      PubSub.unsubscribe("updateForm");
    };
  }, []);
  const columns = [
    {
      title: "分类名称",
      dataIndex: "name",
    },
    {
      title: "操作",
      width: 300,
      render: (category) => (
        <Fragment>
          <LinkButton onClick={showUpdate(category)}>修改分类</LinkButton>
          {parentId === "0" ? (
            <LinkButton onClick={showSubcategorys(category)}>
              查看子分类
            </LinkButton>
          ) : null}
        </Fragment>
      ),
    },
  ];

  return (
    <Card
      title={
        parentId === "0" ? (
          title
        ) : (
          <span>
            <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
            <ArrowRightOutlined className="ArrowRightOutlined" />
            <span>{parentName}</span>
          </span>
        )
      }
      extra={
        <Button
          type="primary"
          onClick={() => {
            setModalVisible((modalVisible) => (modalVisible = 1));
          }}
        >
          <PlusOutlined />
          添加
        </Button>
      }
    >
      <Table
        dataSource={parentId === "0" ? categorys : subcategorys}
        columns={columns}
        bordered
        rowKey="_id"
        pagination={{ defaultPageSize: 5 }}
        loading={loading}
      />
      <Modal
        title="添加分类"
        visible={modalVisible === 1}
        onOk={addCategory}
        onCancel={handleCancel(addForm)}
        okText="确定"
        cancelText="取消"
      >
        <AddForm categorys={categorys} parentId={parentId} />
      </Modal>
      <Modal
        title="修改分类"
        visible={modalVisible === 2}
        onOk={updateCategory}
        onCancel={handleCancel(updateForm)}
        okText="确定"
        cancelText="取消"
      >
        <UpdateForm categoryName={category.name} />
      </Modal>
    </Card>
  );
}
