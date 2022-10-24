import React from "react";
import "./index.less";

//外形像链接的按钮
export default function LinkButton(props) {
  return (
    <button className="link-button" {...props}>
      {props.children}
    </button>
  );
}
