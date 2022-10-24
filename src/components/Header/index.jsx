import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import dayjs from "dayjs";
import LinkButton from "../LinkButton";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { reqWeather } from "../../api/index";
import "./index.less";
import storageUtils from "../../utils/storageUtils";
import memoryUtils from "../../utils/memoryUtils";
const { confirm } = Modal;

export default function Header() {
  const navigator = useNavigate();
  const [time, setTime] = useState(
    dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")
  );
  const [weather, setWeather] = useState("");
  const [title, setTitle] = useState("首页");
  const { username } = memoryUtils.user;

  const getWeather = async () => {
    const result = await reqWeather("大连");
    setWeather((weather) => (weather = result));
  };
  const getTitle = () => {
    PubSub.subscribe("title", (_, data) => {
      setTitle((t) => (t = data));
    });
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        (time) => (time = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    getWeather();
    getTitle();
    return () => {
      PubSub.unsubscribe("title");
    };
  }, [weather, title]);

  const showConfirm = () => {
    confirm({
      title: "你确定要退出登录吗?",
      icon: <ExclamationCircleOutlined />,
      okText: "确定",
      cancelText: "取消",

      onOk() {
        storageUtils.removeUser();
        memoryUtils.user = {};
        navigator("/login", { replace: true });
      },

      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const logoout = () => {
    showConfirm();
  };

  return (
    <header className="header">
      <div className="header-top">
        <span>
          欢迎,<span>{username}</span>
        </span>
        <LinkButton onClick={logoout}>退出</LinkButton>
      </div>
      <div className="header-bottom">
        <div className="header-bottom-left">{title}</div>
        <div className="header-bottom-right">
          <span>{time}</span>
          <span>{weather}</span>
        </div>
      </div>
    </header>
  );
}
