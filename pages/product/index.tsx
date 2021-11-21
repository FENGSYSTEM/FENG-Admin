import {
  createProduct,
  deleteProduct,
  getListProduct,
  getListProductBySub,
} from "@redux/slices/admin/productSlide";
import { Table, Button, Modal, Select, Form, Input, Space, Upload } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadOutlined,
  InboxOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

interface Props {}

export default function Index({}: Props): ReactElement {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.listProduct) as any;
  const createProductLoading = useSelector(
    (state) => state.product.createProductLoading
  );

  const [openCreateModal, setOpenCreateModal] = useState<boolean>();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [productStocksStatic, setProductStocksStatic] = useState<any>();

  useEffect(() => {
    dispatch(getListProduct());
  }, []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "arrival",
      dataIndex: "arrival",
      key: "arrival",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "color",
      dataIndex: "color",
      key: "color",
      render: (colors: any) =>
        colors?.map((obj: any, index: number) => (
          <div className="mr-1">{obj}</div>
        )),
    },
    {
      title: "action",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div
            className="mr-2"
            onClick={async () => {
              await dispatch(deleteProduct(record.id));
              await dispatch(getListProduct());
            }}
          >
            <DeleteOutlined />
          </div>
          <div
            className="mr-2"
            onClick={async () => {
              setOpenCreateModal(true);
              //   let productStocks = form.getFieldValue("productStocks");
              //   record.productStocks.map((obj: any, index: number) => {
              //     console.log({ productStocks, obj, index });
              //     form.getFieldValue("productStocks").add();
              //     // productStocks[index].size = obj.size;
              //     // productStocks[index].amount = obj.amount;
              //   });
              form.setFieldsValue({
                subCategoryId: record.id,
                name: record.name,
                price: record.price,
                arrival: record.arrival,
                status: record.status,
                productStocks: record.productStocks,
                files: record.files,
                color: JSON.stringify(record.color),
                description: record.description,
              });
            }}
          >
            <EditOutlined />
          </div>
        </div>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    const sendData = new FormData();
    sendData.append("subCategoryId", values.subCategoryId);
    sendData.append("name", values.name);
    sendData.append("price", values.price);
    sendData.append("arrival", values.arrival);
    sendData.append("status", values.status);
    sendData.append("productStocks", JSON.stringify(values.productStocks));
    // sendData.append("files", targetImg, targetImg.name);
    values.files.forEach((file: any) => {
      sendData.append("files", file.originFileObj, file.name);
    });
    sendData.append("color", values.color);
    sendData.append("description", values.description);
    await dispatch(createProduct(sendData));
    setOpenCreateModal(false);
    await dispatch(getListProduct());
    form.resetFields();

    // const data = {
    //   subCategoryId: values.subCategoryId,
    //   name: values.name,
    //   price: values.price,
    //   arrival: values.arrival,
    //   status: values.status,
    //   productStocks: JSON.stringify(values.productStocks),
    //   files: targetImg,
    //   color: values.color,
    //   description: values.description,
    // };
    // console.log(data);
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div>
      <Button
        type="primary"
        size="middle"
        onClick={() => setOpenCreateModal(true)}
      >
        create new product
      </Button>

      <Modal
        title="Create a new product"
        style={{ top: 20 }}
        visible={openCreateModal}
        onOk={() => form.submit()}
        onCancel={() => setOpenCreateModal(false)}
        centered
        width={650}
      >
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="subCategoryId"
                  label="Category"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select category" allowClear>
                    <Option value="20">20</Option>
                    <Option value="21">21</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Price" type="number" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="arrival"
                  label="Arrival"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select arrival" allowClear>
                    <Option value="NEW ARRIVAL">NEW ARRIVAL</Option>
                    <Option value="IN-COMING">IN-COMING</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select status" allowClear>
                    <Option value="IN_STOCK">IN_STOCK</Option>
                    <Option value="OUT_OF_STOCK">OUT_OF_STOCK</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.List name="productStocks">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: "flex", marginBottom: 0 }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            label="Size"
                            name={[name, "size"]}
                            fieldKey={[fieldKey, "size"]}
                            rules={[{ required: true }]}
                          >
                            <Select placeholder="select size" allowClear>
                              <Option value="S">S</Option>
                              <Option value="M">M</Option>
                              <Option value="X">X</Option>
                              <Option value="L">L</Option>
                              <Option value="XL">XL</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            label="Amount"
                            name={[name, "amount"]}
                            fieldKey={[fieldKey, "amount"]}
                            rules={[
                              { required: true, message: "Missing amount" },
                            ]}
                          >
                            <Input placeholder="amount" type="number" />
                          </Form.Item>
                          <div onClick={() => remove(name)}>
                            <DeleteOutlined />
                          </div>
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block>
                          Add product stock
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
              <div className="col-12">
                {/* <input
                  type="file"
                  id="update-image"
                  onChange={(e: any) => {
                    console.log(e);
                    setTargetImg(e.target.files[0]);
                  }}
                /> */}
                <Form.Item label="Images">
                  <Form.Item
                    name="files"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={[{ required: true }]}
                  >
                    <Upload
                      listType="picture"
                      name="files"
                      beforeUpload={() => false}
                    >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="color"
                  label="Color"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Color" />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Description" />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Processing"
        width={260}
        centered
        visible={createProductLoading}
        footer={false}
        closable={false}
      >
        <div className="d-flex align-items-center">
          <LoadingOutlined className="mr-2" />
          processing your request...
        </div>
      </Modal>
      <Table columns={columns} dataSource={productList} />
    </div>
  );
}
