import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import LinkButton from "../../components/LinkButton";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api";

export default function ProductDetail() {
  const navigator = useNavigate();
  const {
    state: {
      product: { name, desc, price, detail, imgs, categoryId, pCategoryId },
    },
  } = useLocation();
  const [cName1, setCName1] = useState();
  const [cName2, setCName2] = useState();

  const getCategoryId = useCallback(async () => {
    if (categoryId === "0") {
      const result = await reqCategory(categoryId);
      setCName1((cName1) => (cName1 = result.data.name));
    } else {
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      setCName1((cName1) => (cName1 = results[0].data.name));
      setCName2((cName2) => (cName2 = results[1].data.name));
    }
  }, [categoryId, pCategoryId]);

  React.useEffect(() => {
    getCategoryId();
  }, [getCategoryId]);
  return (
    <Card
      title={
        <span>
          <LinkButton onClick={() => navigator("/admin/products/product/home")}>
            <ArrowLeftOutlined className="arrow-left" />
          </LinkButton>
          <span className="title">商品详情</span>
        </span>
      }
      className="product-detail"
    >
      <List>
        <List.Item className="list-item">
          <span className="left">商品名称:</span>
          <span>{name}</span>
        </List.Item>
        <List.Item className="list-item">
          <span className="left">商品描述:</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item className="list-item">
          <span className="left">商品价格:</span>
          <span>{price}元</span>
        </List.Item>
        <List.Item className="list-item">
          <span className="left">所属分类:</span>
          <span>
            {cName1}
            {cName2 ? "-->" + cName2 : ""}
          </span>
        </List.Item>
        <List.Item className="list-item">
          <span className="left">商品图片:</span>
          {imgs.length !== 0 ? (
            <span>
              {imgs.map((img) => (
                <img
                  key={img}
                  src={BASE_IMG_URL + img}
                  className="product-img"
                  alt="img"
                />
              ))}
            </span>
          ) : (
            <span>暂无图片</span>
          )}
        </List.Item>
        <List.Item className="list-item">
          <span className="left">商品详情:</span>
          <span dangerouslySetInnerHTML={{ __html: detail }}></span>
        </List.Item>
      </List>
    </Card>
  );
}
