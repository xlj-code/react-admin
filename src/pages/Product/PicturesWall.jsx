import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import { PlusOutlined } from "@ant-design/icons";
import { message, Modal, Upload } from "antd";
import { reqDeleteImg } from "../../api";
import { BASE_IMG_URL } from "../../utils/constants";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

function PicturesWall(props, ref) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);

  React.useEffect(() => {
    if (props.imgs) {
      setFileList(
        (fileList) =>
          (fileList = props.imgs.map((img, index) => ({
            uid: -index,
            name: img,
            status: "done",
            url: BASE_IMG_URL + img,
          })))
      );
    }
  }, [props.imgs]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ file, fileList: newFileList }) => {
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("图片上传成功");
        const { name, url } = result.data;
        file = fileList[fileList.length - 1];
        file.url = url;
        file.name = name;
      } else {
        message.error("图片上传失败");
      }
    }

    if (file.status === "done" && newFileList.length < fileList.length) {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("图片删除成功");
      } else {
        message.error("图片删除失败");
      }
    }

    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  React.useImperativeHandle(ref, () => ({
    getImgs: () => {
      return fileList.map((file) => file.name);
    },
  }));

  return (
    <>
      <Upload
        action="/manage/img/upload" /*上传图片的接口地址*/
        accept="image/*" /*只接收图片格式*/
        name="image" //请求参数名
        listType="picture-card" /*卡片样式*/
        fileList={fileList} /*所有已上传图片文件对象的数组*/
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
}

PicturesWall.prototype.propTypes = {
  imgs: PropTypes.array,
};
export default forwardRef(PicturesWall);
