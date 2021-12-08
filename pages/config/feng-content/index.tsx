import UploadOutlined from "@ant-design/icons/lib/icons/UploadOutlined";
import {
  createConfig,
  getConfig,
} from "@redux/slices/admin/configContentSlice";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Input, Space, Upload } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

export default function index({}: Props): ReactElement {
  const dispatch = useDispatch();
  const configData = useSelector((state) => state.config.configData) as any;

  const [contactEditor, setContactEditor] = useState<any>();
  const [contactEditorInitContent, setContactEditorInitContent] =
    useState<any>();
  const [aboutUsEditor, setAboutUsEditor] = useState<any>();
  const [aboutUsEditorInitContent, setAboutUsEditorInitContent] =
    useState<any>();
  const [customerCareEditor, setCustomerCareEditor] = useState<any>();
  const [customerCareEditorInitContent, setCustomerCareEditorInitContent] =
    useState<any>();

  const [splashTitle, setSplashTitle] = useState<any>();
  const [splashDescription, setSplashDescription] = useState<any>();
  const [splashImage, setSplashImage] = useState<any>();

  const tinyDefaultPlugin = [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
  ];

  useEffect(() => {
    dispatch(getConfig());
  }, []);

  useEffect(() => {
    setContactEditorInitContent(configData?.contact);
    setAboutUsEditorInitContent(configData?.aboutUs);
    setCustomerCareEditorInitContent(configData?.customerCare);
    setSplashTitle(configData?.title);
    setSplashDescription(configData?.description);
  }, [configData]);

  const handleUpdateConfigs = async () => {
    const sendData = new FormData();
    sendData.append("customerCare", customerCareEditor.getContent());
    sendData.append("aboutUs", aboutUsEditor.getContent());
    sendData.append("contact", contactEditor.getContent());
    sendData.append("title", splashTitle);
    sendData.append("description", splashDescription);
    if (splashImage) {
      sendData.append("file", splashImage.originFileObj, splashImage.name);
    }
    await dispatch(createConfig(sendData));
  };

  return (
    <div className="w-100">
      <div className="col-12">
        <div className="row">
          <div className="col-6 mb-4">
            <h2>Contact content</h2>
            <Editor
              apiKey="cmba0fnvigwepex6qxozkc4ngm629qui01c8txusfvjppwbr"
              onInit={(evt, editor) => setContactEditor(editor)}
              initialValue={contactEditorInitContent}
              init={{
                height: 500,
                menubar: true,
                plugins: tinyDefaultPlugin,
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="col-6 mb-4">
            <h2>About us content</h2>
            <Editor
              apiKey="cmba0fnvigwepex6qxozkc4ngm629qui01c8txusfvjppwbr"
              onInit={(evt, editor) => setAboutUsEditor(editor)}
              initialValue={aboutUsEditorInitContent}
              init={{
                height: 500,
                menubar: true,
                plugins: tinyDefaultPlugin,
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="col-6 mb-4">
            <h2>Customer Care / Q&A content</h2>
            <Editor
              apiKey="cmba0fnvigwepex6qxozkc4ngm629qui01c8txusfvjppwbr"
              onInit={(evt, editor) => setCustomerCareEditor(editor)}
              initialValue={customerCareEditorInitContent}
              init={{
                height: 500,
                menubar: true,
                plugins: tinyDefaultPlugin,
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="col-6 mb-4">
            <h2>Splash screen content</h2>
            <Space direction="vertical" className="w-100" size="middle">
              <Input addonBefore="Title:" value={splashTitle} />
              <Input addonBefore="Description:" value={splashDescription} />
              {configData?.image && (
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <img src={configData?.image} style={{ width: "150px" }} />
                      <a
                        href={configData?.image}
                        className="mx-3 break-word"
                        target="_blank"
                      >
                        {configData?.image}
                      </a>
                    </div>
                  </div>
                  <hr />
                </div>
              )}
              <Upload
                listType="picture"
                name="files"
                beforeUpload={() => false}
                onChange={(info: any) => setSplashImage(info.fileList[0])}
              >
                <Button icon={<UploadOutlined />}>
                  Update new splash screen image
                </Button>
              </Upload>
            </Space>
            <div className="my-2 d-flex align-items-center justify-content-end">
              <Button type="primary" onClick={() => handleUpdateConfigs()}>
                Update Config
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
