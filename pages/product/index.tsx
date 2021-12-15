import {
  createProduct,
  deleteProduct,
  getListProduct,
  getListProductBySub,
  updateProduct,
} from "@redux/slices/admin/productSlice";
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
import { Editor } from "@tinymce/tinymce-react";

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
  const [productColors, setProductColors] = useState<any[]>([]) as any;

  const [isCreateNew, setIsCreateNew] = useState<boolean>(true);
  // isCreateNew === false => means update.
  const [currentProductId, setCurrentProductId] = useState<any>();
  const [productDataImgList, setProductDataImgList] = useState<any[]>();

  const [categoryFilter, setCategoryFilter] = useState<any>("");
  const [subCategoryFilter, setSubcategoryFilter] = useState<any>("");
  const [categoryFilterData, setCategoryFilterData] = useState<any>();
  const [subCategoryFilterData, setSubCategoryFilterData] = useState<any>();

  useEffect(() => {
    dispatch(
      getListProduct({
        category: categoryFilter,
        subCategoryUrl: subCategoryFilter,
      })
    );
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
      setCategoryFilterData(data);
      console.log(data);
    }
    initCategory();
  }, []);

  const handleColorPicker = (color: any) => {
    console.log(color);
    setProductColors((prev: any) => [
      ...prev,
      { color_code: color.hex, color_name: "" },
    ]);
    setOpenPickColor(false);
  };

  useEffect(() => {
    console.log(productColors);
    form.setFieldsValue({ color: productColors });
  }, [productColors]);

  const editorRef = useRef<any>(null);
  const [descriptionEditor, setDescriptionEditor] = useState<any>();
  const [descriptionEditorInitContent, setDescriptionEditorInitContent] =
    useState<any>();

  const handleCreateNew = () => {
    setIsCreateNew(true);
    setOpenCreateModal(true);
    form.resetFields();
    setDescriptionEditorInitContent("");
    setSelectedCategory([]);
    setSelectedSubCategory([]);
    setProductColors([]);
    setProductDataImgList([]);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (imgsUrl: any) => (
        <img src={imgsUrl[0]} style={{ height: "100px" }} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text: any) => <a>{text.name}</a>,
    },
    {
      title: "Sub category",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (text: any) => <a>{text.name}</a>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Arrival",
      dataIndex: "arrival",
      key: "arrival",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (colors: any) =>
        colors?.color_code?.map((obj: any, index: number) => (
          <div className="d-flex align-items-center">
            <div
              className="mx-2"
              style={{
                width: "20px",
                height: "20px",
                background: obj,
                border: "2px solid #000",
              }}
            />
            <div>{obj}</div>
          </div>
        )),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: any) => (
        <div className="d-flex align-items-center">
          <div
            className="mr-2"
            onClick={async () => {
              await dispatch(deleteProduct(record.id));
              await dispatch(
                getListProduct({
                  category: categoryFilter,
                  subCategoryUrl: subCategoryFilter,
                })
              );
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
              setSelectedSubCategory(record.subCategory.Url);

              form.setFieldsValue({ subCategoryId: record.subCategory.Url });
              setProductDataImgList(record.images);
              setCurrentProductId(record.id);
              // ---

              setOpenCreateModal(true);
              form.setFieldsValue({
                category: record.category.name,
                subCategoryUrl: record.subCategory.url,
                name: record.name,
                price: record.price,
                priceUS: record.priceUS,
                priceOld: record.priceOld,
                priceUSOld: record.priceUSOld,
                arrival: record.arrival,
                status: record.status,
                productStocks: record.productStocks,
                // files: record.files,
                color: record.color,
                description: record.description,
              });
              // descriptionEditor?.setContent(record.description);
              setDescriptionEditorInitContent(record.description);
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
      sendData.append("category", values.category);
      sendData.append("subCategoryUrl", values.subCategoryUrl);
      sendData.append("name", values.name);
      sendData.append("price", values.price);
      sendData.append("priceOld", values.priceOld);
      sendData.append("priceUS", values.priceUS);
      sendData.append("priceUSOld", values.priceUSOld);
      sendData.append("arrival", values.arrival);
      sendData.append("status", values.status);
      sendData.append("productStocks", JSON.stringify(values.productStocks));
      values.files.forEach((file: any) => {
        sendData.append("files", file.originFileObj, file.name);
      });
      sendData.append("color", JSON.stringify(values.color));
      if (descriptionEditor) {
        await form.setFieldsValue({
          description: descriptionEditor.getContent(),
        });
      }
      sendData.append("description", descriptionEditor.getContent());
      console.log(values);
      await dispatch(createProduct(sendData));
      setOpenCreateModal(false);
      await dispatch(
        getListProduct({
          category: categoryFilter,
          subCategoryUrl: subCategoryFilter,
        })
      );
      form.resetFields();
    } else {
      console.log("update");
      const sendData = new FormData();
      console.log(values);
      sendData.append("category", values.category);
      sendData.append("subCategoryUrl", values.subCategoryUrl);
      sendData.append("name", values.name);
      sendData.append("price", values.price);
      sendData.append("priceOld", values.priceOld);
      sendData.append("priceUS", values.priceUS);
      sendData.append("priceUSOld", values.priceUSOld);
      sendData.append("arrival", values.arrival);
      sendData.append("status", values.status);
      sendData.append("productStocks", JSON.stringify(values.productStocks));
      sendData.append("color", JSON.stringify(values.color));
      if (descriptionEditor) {
        await form.setFieldsValue({
          description: descriptionEditor.getContent(),
        });
      }
      sendData.append("description", descriptionEditor.getContent());
      sendData.append("images", JSON.stringify(productDataImgList));
      if (values.files) {
        values.files.forEach((file: any) => {
          sendData.append("files", file.originFileObj, file.name);
        });
      }
      await dispatch(updateProduct({ data: sendData, id: currentProductId }));
      setOpenCreateModal(false);
      await dispatch(
        getListProduct({
          category: categoryFilter,
          subCategoryUrl: subCategoryFilter,
        })
      );
      form.resetFields();
    }
  };

  const normFile = (e: any) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    console.log(categoryFilter, subCategoryFilter);
    dispatch(
      getListProduct({
        category: categoryFilter,
        subCategoryUrl: subCategoryFilter,
      })
    );
  }, [categoryFilter, subCategoryFilter]);

  return (
    <div>
      <div className="mb-3 w-100 d-flex align-items-center">
        <Button
          size="middle"
          className="mr-2"
          onClick={() => handleCreateNew()}
        >
          Create new product
        </Button>
        <Select
          className="mr-2"
          placeholder="select category"
          value={categoryFilter}
          style={{ width: 150 }}
          onChange={async (e) => {
            setSubcategoryFilter([]);
            setSubCategoryFilterData(await apiGetSubCategory(e as string));
            setCategoryFilter(e);
          }}
        >
          {categoryFilterData?.map((obj: any, index: number) => (
            <Option value={obj.name} key={`category-${index}`}>
              {obj.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="select sub category"
          value={subCategoryFilter}
          style={{ width: 150 }}
          className="mr-2"
          onChange={(e) => {
            setSubcategoryFilter(e);
          }}
        >
          {subCategoryFilterData?.map((obj: any, index: number) => (
            <Option value={obj.url} key={`category-${index}`}>
              {obj.name}
            </Option>
          ))}
        </Select>
        <Button
          size="middle"
          onClick={() => {
            setCategoryFilter("");
            setSubcategoryFilter("");
          }}
        >
          Remove filter
        </Button>
      </div>

      <Modal
        title={`${isCreateNew ? "Create new product" : "Update product info"}`}
        style={{ top: 20 }}
        visible={openCreateModal}
        onOk={() => form.submit()}
        onCancel={() => setOpenCreateModal(false)}
        centered
        width={750}
      >
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true }]}
                  >
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
                  </Form.Item>
                  <Form.Item
                    name="subCategoryUrl"
                    label="Category"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="select sub category"
                      value={selectedSubCategory}
                      allowClear
                      onChange={(e) => {
                        console.log(e);
                        setSelectedSubCategory(e);
                        // form.setFieldsValue({ subCategoryUrl: e });
                      }}
                    >
                      {selectBoxSubCategory?.map((obj: any, index: number) => (
                        <Option value={obj.url} key={`category-${index}`}>
                          {obj.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
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
                <div className="row">
                  <div className="col-6">
                    <Form.Item
                      name="price"
                      label="Price in VND"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Price in VND" type="number" />
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item
                      name="priceUS"
                      label="Price in US"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Price in US" type="number" />
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item
                      name="priceOld"
                      label="Price in VND Old"
                      rules={[{ required: false }]}
                    >
                      <Input placeholder="Price in VND Old" type="number" />
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item
                      name="priceUSOld"
                      label="Price in US Old"
                      rules={[{ required: false }]}
                    >
                      <Input placeholder="Price in US Old" type="number" />
                    </Form.Item>
                  </div>
                </div>
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
                  <Button onClick={() => setOpenPickColor(!openPickColor)}>
                    Pick color
                  </Button>
                  {openPickColor && (
                    <SwatchesPicker onChange={handleColorPicker} />
                  )}
                  {productColors?.map((color: any, index: number) => (
                    <div className="my-2 w-100 d-flex justify-content-between align-items-center">
                      <div>{color.color_code}</div>
                      <div className="mx-2">{color.color_name}</div>
                      <Input
                        className="w-25 mx-2"
                        placeholder="update color name"
                        // defaultValue={color.color_name}
                        onChange={async (e) => {
                          let cloneColors = (await [...productColors]) as any;
                          let updateIndex = await cloneColors.findIndex(
                            (e: any) => e.color_code === color.color_code
                          );
                          cloneColors[updateIndex] = {
                            ...cloneColors[updateIndex],
                            color_name: e.target.value,
                          };
                          setProductColors(cloneColors);
                        }}
                      />
                      <div className="d-flex align-items-center">
                        <div
                          className="mx-2"
                          style={{
                            width: "20px",
                            height: "20px",
                            background: color.color_code,
                            border: "2px solid #000",
                          }}
                        />
                        <DeleteOutlined
                          className="cursor-pointer"
                          onClick={() => {
                            let cloneColors = [...productColors];
                            let deletedIndex = cloneColors.findIndex(
                              (e: any) => e.color_code === color.color_code
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
                  rules={[{ required: false }]}
                >
                  {/* <Input placeholder="Description" /> */}
                </Form.Item>
                <Editor
                  apiKey="cmba0fnvigwepex6qxozkc4ngm629qui01c8txusfvjppwbr"
                  onInit={(evt, editor) => setDescriptionEditor(editor)}
                  initialValue={descriptionEditorInitContent}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
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
