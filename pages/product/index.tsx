import {
  createProduct,
  deleteProduct,
  getListProduct,
  getListProductBySub,
  updateProduct,
} from "@redux/slices/admin/productSlide";
import { Table, Button, Modal, Select, Form, Input, Space, Upload } from "antd";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadOutlined,
  InboxOutlined,
  LoadingOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { SwatchesPicker } from "react-color";
import { apiGetCategory, apiGetSubCategory } from "src/api/product";

interface Props {}

export default function Index({}: Props): ReactElement {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.listProduct) as any;
  const createProductLoading = useSelector(
    (state) => state.product.createProductLoading
  );

  const [openPickColor, setOpenPickColor] = useState<boolean>(false);

  const [openCreateModal, setOpenCreateModal] = useState<boolean>();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [productStocksStatic, setProductStocksStatic] = useState<any>();
  const [productColors, setProductColors] = useState<any[]>([]);

  const [isCreateNew, setIsCreateNew] = useState<boolean>(true);
  // isCreateNew === false => means update.
  const [currentProductId, setCurrentProductId] = useState<any>();
  const [productDataImgList, setProductDataImgList] = useState<any[]>();

  useEffect(() => {
    dispatch(getListProduct());
  }, []);

  /**
   * @selectBox category & subCategory
   */
  const [selectBoxCategory, setSelectBoxCategory] = useState<any>();
  const [selectBoxSubCategory, setSelectBoxSubCategory] = useState<any>();
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>();

  useEffect(() => {
    async function initCategory() {
      const data = await apiGetCategory();
      setSelectBoxCategory(data);
      console.log(data);
    }
    initCategory();
  }, []);

  const handleColorPicker = (color: any) => {
    console.log(color);
    setProductColors((prev) => [...prev, color.hex]);
    setOpenPickColor(false);
  };

  useEffect(() => {
    console.log(productColors);
    form.setFieldsValue({ color: productColors });
  }, [productColors]);

  const handleCreateNew = () => {
    setIsCreateNew(true);
    setOpenCreateModal(true);
    form.resetFields();
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setProductColors([]);
    setProductDataImgList([]);
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "image",
      dataIndex: "images",
      key: "images",
      render: (imgsUrl: any) => (
        <img src={imgsUrl[0]} style={{ height: "100px" }} />
      ),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "category",
      dataIndex: "category",
      key: "category",
      render: (text: any) => <a>{text.name}</a>,
    },
    {
      title: "subCategory",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text: any) => <a>{text.name}</a>,
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
              // handleUpdatePopup
              setIsCreateNew(false);
              console.log(record);
              setProductColors(record.color);
              // set Selected category
              setSelectBoxSubCategory(
                await apiGetSubCategory(record.category.name)
              );
              setSelectedCategory(record.category.name);
              setSelectedSubCategory(record.subCategory.id);
              form.setFieldsValue({ subCategoryId: record.subCategory.id });
              setProductDataImgList(record.images);
              setCurrentProductId(record.id);
              // ---
              setOpenCreateModal(true);
              form.setFieldsValue({
                productId: record.id,
                name: record.name,
                price: record.price,
                arrival: record.arrival,
                status: record.status,
                productStocks: record.productStocks,
                // files: record.files,
                color: record.color,
                description: record.description,
              });
            }}
          >
            <EditOutlined className="cursor-pointer" />
          </div>
        </div>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    if (isCreateNew) {
      const sendData = new FormData();
      sendData.append("subCategoryId", values.subCategoryId);
      sendData.append("name", values.name);
      sendData.append("price", values.price);
      sendData.append("arrival", values.arrival);
      sendData.append("status", values.status);
      sendData.append("productStocks", JSON.stringify(values.productStocks));
      values.files.forEach((file: any) => {
        sendData.append("files", file.originFileObj, file.name);
      });
      sendData.append("color", JSON.stringify(values.color));
      sendData.append("description", values.description);
      console.log(values);
      await dispatch(createProduct(sendData));
      setOpenCreateModal(false);
      await dispatch(getListProduct());
      form.resetFields();
    } else {
      console.log("update");
      const sendData = new FormData();
      console.log(values);
      sendData.append("subCategoryId", values.subCategoryId);
      sendData.append("name", values.name);
      sendData.append("price", values.price);
      sendData.append("arrival", values.arrival);
      sendData.append("status", values.status);
      sendData.append("productStocks", JSON.stringify(values.productStocks));
      sendData.append("color", JSON.stringify(values.color));
      sendData.append("description", values.description);
      sendData.append("images", JSON.stringify(productDataImgList));
      if (values.files) {
        values.files.forEach((file: any) => {
          sendData.append("files", file.originFileObj, file.name);
        });
      }
      await dispatch(updateProduct({ data: sendData, id: currentProductId }));
      setOpenCreateModal(false);
      await dispatch(getListProduct());
      form.resetFields();
    }
    //----

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
      <Button type="primary" size="middle" onClick={() => handleCreateNew()}>
        Create new product
      </Button>

      <Modal
        title={`${isCreateNew ? "Create new product" : "Update product info"}`}
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
                  <div className="d-flex justify-content-between">
                    <Select
                      className="mr-2"
                      placeholder="select category"
                      value={selectedCategory}
                      onChange={async (e) => {
                        setSelectedSubCategory([]);
                        setSelectBoxSubCategory(
                          await apiGetSubCategory(e as string)
                        );
                        setSelectedCategory(e);
                      }}
                    >
                      {selectBoxCategory?.map((obj: any, index: number) => (
                        <Option value={obj.name} key={`category-${index}`}>
                          {obj.name}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="select sub category"
                      value={selectedSubCategory}
                      allowClear
                      onChange={(e) => {
                        console.log(e);
                        form.setFieldsValue({ subCategoryId: e });
                        setSelectedSubCategory(e);
                      }}
                    >
                      {selectBoxSubCategory?.map((obj: any, index: number) => (
                        <Option value={obj.id} key={`category-${index}`}>
                          {obj.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
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
                {productDataImgList &&
                  productDataImgList.map((imgUrl: string, index: number) => (
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <img src={imgUrl} style={{ height: "80px" }} />
                          <a
                            href={imgUrl}
                            className="mx-3 break-word"
                            target="_blank"
                          >
                            {imgUrl}
                          </a>
                        </div>
                        <DeleteOutlined
                          className="cursor-pointer"
                          onClick={() => {
                            let cloneImages = [...productDataImgList];
                            let deletedIndex = cloneImages.findIndex(
                              (e: any) => e === imgUrl
                            );
                            cloneImages.splice(deletedIndex, 1);
                            console.log(cloneImages);
                            setProductDataImgList(cloneImages);
                          }}
                        />
                      </div>
                      <hr />
                    </div>
                  ))}
                <Form.Item label="Images">
                  <Form.Item
                    name="files"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    noStyle
                    rules={
                      isCreateNew ? [{ required: true }] : [{ required: false }]
                    }
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
                  <Button
                    type="primary"
                    onClick={() => setOpenPickColor(!openPickColor)}
                  >
                    Pick color
                  </Button>
                  {openPickColor && (
                    <SwatchesPicker onChange={handleColorPicker} />
                  )}
                  {productColors?.map((color: string, index: number) => (
                    <div className="my-2 w-100 d-flex justify-content-between align-content-center">
                      <div>{color}</div>
                      <div className="d-flex align-items-center">
                        <div
                          className="mx-2"
                          style={{
                            width: "20px",
                            height: "20px",
                            background: color,
                          }}
                        />
                        <DeleteOutlined
                          className="cursor-pointer"
                          onClick={() => {
                            let cloneColors = [...productColors];
                            let deletedIndex = cloneColors.findIndex(
                              (e: any) => e === color
                            );
                            cloneColors.splice(deletedIndex, 1);
                            console.log(cloneColors);
                            setProductColors(cloneColors);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* <Input placeholder="Color" /> */}
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
