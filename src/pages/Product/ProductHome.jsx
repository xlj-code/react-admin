import React, { useState, useCallback } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export default function Product() {
  const navigator = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("productName");
  const getProducts = useCallback(
    async (pageNum) => {
      setLoading((loading) => (loading = true));
      let result;
      setPageNum((p) => (p = pageNum));
      if (searchName) {
        result = await reqSearchProducts({
          pageNum,
          pageSize: PAGE_SIZE,
          searchName,
          searchType,
        });
      } else {
        result = await reqProducts(pageNum, PAGE_SIZE);
      }
      setLoading((loading) => (loading = false));
      if (result.status === 0) {
        setProducts((products) => (products = result.data.list));
        setTotal((total) => (total = result.data.total));
      }
    },
    [searchName, searchType]
  );

  const updateStatus = (productId, status) => {
    return async () => {
      const result = await reqUpdateStatus(productId, status);
      if (result.status === 0) {
        getProducts(pageNum);
        message.success("商品状态更新成功");
      }
    };
  };

  React.useEffect(() => {
    getProducts(pageNum);
  }, [getProducts, pageNum]);

  const columns = [
    {
      title: "商品名称",
      dataIndex: "name",
    },
    {
      title: "商品描述",
      dataIndex: "desc",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (price) => "￥" + price,
    },
    {
      title: "状态",
      width: 100,
      render: (product) => {
        const { _id, status } = product;
        return (
          <span>
            <Button
              type="primary"
              onClick={updateStatus(_id, status === 1 ? 2 : 1)}
            >
              {status === 1 ? "下架" : "上架"}
            </Button>
            <span>{status === 1 ? "在售" : "已下架"}</span>
          </span>
        );
      },
    },
    {
      title: "操作",
      width: 100,
      render: (product) => {
        return (
          <span>
            <LinkButton
              onClick={() => {
                navigator("/admin/products/product/detail", {
                  state: { product },
                });
              }}
            >
              详情
            </LinkButton>
            <LinkButton
              onClick={() => {
                navigator("/admin/products/product/addupdate", {
                  state: { product },
                });
              }}
            >
              修改
            </LinkButton>
          </span>
        );
      },
    },
  ];
  return (
    <Card
      title={
        <span>
          <Select
            value={searchType}
            style={{ width: 150 }}
            onChange={(value) =>
              setSearchType((searchType) => (searchType = value))
            }
          >
            <Select.Option value="productName">按名称搜索</Select.Option>
            <Select.Option value="productDesc">按描述搜索</Select.Option>
          </Select>
          <Input
            placeholder="请输入关键字"
            style={{ width: 150, margin: "0 15px" }}
            value={searchName}
            onChange={(event) =>
              setSearchName((searchName) => (searchName = event.target.value))
            }
          />
          <Button type="primary" onClick={() => getProducts(1)}>
            搜索
          </Button>
        </span>
      }
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigator("/admin/products/product/addupdate", {
              state: { product: {} },
            });
          }}
        >
          <PlusOutlined />
          添加商品
        </Button>
      }
    >
      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        pagination={{
          defaultPageSize: PAGE_SIZE,
          total: total,
          onChange: (pageNum) => getProducts(pageNum),
        }}
        bordered
        loading={loading}
      />
    </Card>
  );
}
