import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Input, Cascader, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";

const { TextArea } = Input;
let optionLists;
export default function ProductAddUpdate() {
  const navigator = useNavigate();
  const [form] = Form.useForm();
  const product = useLocation().state.product;
  const {
    state: {
      product: { _id, imgs, detail, pCategoryId, categoryId },
    },
  } = useLocation();
  const [options, setOptions] = useState(optionLists);
  const isUpdate = !!product.pCategoryId; //!!product强制转换给boolean类型
  const categoryIds = []; //用来接收级联分类ID的数组
  const pwRef = React.useRef();
  const editorRef = React.createRef();
  if (isUpdate) {
    if (pCategoryId === "0") {
      categoryIds.push(categoryId);
    } else {
      categoryIds.push(pCategoryId);
      categoryIds.push(categoryId);
    }
  }
  const initOptions = async (categorys) => {
    optionLists = categorys.map((category) => ({
      value: category._id,
      label: category.name,
      isLeaf: false,
    }));

    if (isUpdate && pCategoryId !== "0") {
      const subCategorys = await getCategorys(pCategoryId);
      const childOptions = subCategorys.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
        isLeaf: true,
      }));
      const targetOption = optionLists.find(
        (option) => option.value === pCategoryId
      );
      targetOption.children = childOptions;
    }
    setOptions((options) => (options = optionLists));
  };

  const validatePrice = (rule, value) => {
    if (value * 1 < 0) {
      return Promise.reject("商品价格不能小于0");
    } else {
      return Promise.resolve();
    }
  };

  const getCategorys = useCallback(async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        initOptions(categorys);
      } else {
        return categorys; //当前async函数返回的promise状态成功且返回的值是categorys
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true; // load options lazily
    const subCategorys = await getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
        isLeaf: true,
      }));
      setTimeout(() => {
        targetOption.children = childOptions;
        setOptions([...options]);
      }, 500);
    } else {
      targetOption.isLeaf = true;
      setOptions([...options]);
    }
  };

  const onFinish = () => {
    form
      .validateFields()
      .then(async (values) => {
        const { name, desc, price, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }

        const imgs = pwRef.current.getImgs();
        const detail = editorRef.current.getDetail();
        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId,
        };

        if (isUpdate) {
          product._id = _id;
        }

        const result = await reqAddOrUpdateProduct(product);
        if (result.status === 0) {
          message.success(`${isUpdate ? "更新" : "添加"}成功`);
          navigator("/admin/products/product/home");
        } else {
          message.error(`${isUpdate ? "更新" : "添加"}失败`);
        }
      })
      .catch((errorInfo) => {
        Promise.reject(errorInfo);
      });
  };

  React.useEffect(() => {
    getCategorys("0");
  }, [getCategorys]);

  return (
    <Card
      title={
        <span>
          <LinkButton onClick={() => navigator("/admin/products/product/home")}>
            <ArrowLeftOutlined className="arrow-left" />
          </LinkButton>
          <span className="title">{isUpdate ? "修改商品" : "添加商品"}</span>
        </span>
      }
      className="product-addupdate"
    >
      <Form
        labelCol={{
          span: 2,
        }}
        wrapperCol={{
          span: 8,
        }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="商品名称"
          initialValue={product.name}
          rules={[{ required: true, message: "商品名称不能为空" }]}
        >
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item
          name="desc"
          label="商品描述"
          initialValue={product.desc}
          rules={[{ required: true, message: "商品描述不能为空" }]}
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        <Form.Item
          name="price"
          label="商品价格"
          initialValue={product.price}
          rules={[
            { required: true, message: "商品名称不能为空" },
            { validator: validatePrice },
          ]}
        >
          <Input type="number" addonAfter="元" />
        </Form.Item>
        <Form.Item
          label="商品分类"
          name="categoryIds"
          initialValue={categoryIds}
          rules={[{ required: true, message: "商品名称不能为空" }]}
        >
          <Cascader
            placeholder="请选择商品分类"
            options={options} //需要显示的列表数据数组
            loadData={loadData} //当选择某一个列表项，加载下一个列表的回调
          />
        </Form.Item>
        <Form.Item label="商品图片">
          <PicturesWall ref={pwRef} imgs={imgs} />
        </Form.Item>
        <Form.Item
          label="商品详情"
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 20,
          }}
        >
          <RichTextEditor ref={editorRef} detail={detail} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
