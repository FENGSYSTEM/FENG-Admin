import {
  createSubCategory,
  getListCategory,
  getListSubCategory,
  updateSubCategory,
} from "@redux/slices/admin/categorySlice";
import { Button, Input, Modal, Select, Space, Table } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

export default function IndexCategory({}: Props): ReactElement {
  const dispatch = useDispatch();
  const { Option } = Select;
  const listCategory = useSelector((state) => state.category.listCategory);
  const listSubCategory = useSelector(
    (state) => state.category.listSubCategory
  );

  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [openCreateSubCategoryModal, setOpenCreateSubCategoryModal] =
    useState<boolean>(false);

  const [subCategoryInfo, setSubCategoryInfo] = useState<any>();

  const [selectedCategory, setSelectedCategory] = useState<any>();
  useEffect(() => {
    dispatch(getListCategory());
  }, []);

  const [subCategoryName, setSubCategoryName] = useState<any>();
  const [subCategoryUrl, setSubCategoryUrl] = useState<any>();
  const [selectedCategoryUpdate, setSelectedCategoryUpdate] = useState<any>();

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
    },
    {
      title: "Action",
      dateIndex: "action",
      key: "action",
      render: (text: string, record: any) => {
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              setSubCategoryInfo(record);
              setOpenCategoryModal(true);
              setSubCategoryName(record?.name);
              setSubCategoryUrl(record?.url);
              setSelectedCategoryUpdate(selectedCategory);
              //   setOrderInfo(record);
              //   setOrderStatusSelect(record.status);
              //   setOpenOrderModal(true);
            }}
          >
            Edit
          </div>
        );
      },
    },
  ];

  const handleUpdateSubCategory = async (id: any) => {
    const data = {
      categoryName: selectedCategoryUpdate,
      name: subCategoryName,
      url: subCategoryUrl,
    };
    await dispatch(updateSubCategory({ subCategoryId: id, data }));
    await dispatch(getListSubCategory(selectedCategory));
    setOpenCategoryModal(false);
  };
  const handleCreateNew = async () => {
    const data = {
      categoryName: selectedCategory,
      name: subCategoryName,
      url: subCategoryUrl,
    };
    await dispatch(createSubCategory(data));
    await dispatch(getListSubCategory(selectedCategory));
    setOpenCreateSubCategoryModal(false);
  };
  return (
    <div className="w-100">
      <div>
        <Select
          className="mr-2"
          placeholder="select category"
          value={selectedCategory}
          style={{ width: 150 }}
          onChange={async (e) => {
            setSelectedCategory(e);
            dispatch(getListSubCategory(e));
          }}
        >
          {listCategory?.map((obj: any, index: number) => (
            <Option value={obj.name}>{obj.name}</Option>
          ))}
        </Select>
      </div>
      {selectedCategory && (
        <div>
          <h3 className="my-3">Sub categories - {selectedCategory}</h3>
          <div className="my-3">
            <Button onClick={() => setOpenCreateSubCategoryModal(true)}>
              Create new sub category
            </Button>
          </div>
        </div>
      )}
      <Table columns={columns} dataSource={listSubCategory} />
      <Modal
        title={`Edit sub category - ID: ${subCategoryInfo?.id} - [${selectedCategory} - ${subCategoryInfo?.name}]`}
        style={{ top: 20 }}
        visible={openCategoryModal}
        onOk={() => handleUpdateSubCategory(subCategoryInfo?.id)}
        onCancel={() => setOpenCategoryModal(false)}
        centered
        width={650}
      >
        <Space direction="vertical" className="w-100">
          <Input addonBefore="ID:" value={subCategoryInfo?.id} disabled />
          <Input
            addonBefore="Sub category name:"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
          <Input
            addonBefore="Sub category URL:"
            value={subCategoryUrl}
            onChange={(e) => setSubCategoryUrl(e.target.value)}
          />
          <div className="d-flex align-items-center">
            <div className="mr-2">Select category: </div>
            <Select
              className="mr-2"
              placeholder="select category"
              value={selectedCategoryUpdate}
              style={{ width: 150 }}
              onChange={async (e) => {
                setSelectedCategoryUpdate(e);
              }}
            >
              {listCategory?.map((obj: any, index: number) => (
                <Option value={obj.name}>{obj.name}</Option>
              ))}
            </Select>
          </div>
        </Space>
      </Modal>
      <Modal
        title={`Create new sub category`}
        style={{ top: 20 }}
        visible={openCreateSubCategoryModal}
        onOk={() => handleCreateNew()}
        onCancel={() => setOpenCreateSubCategoryModal(false)}
        centered
        width={650}
      >
        <Space direction="vertical" className="w-100">
          <Input
            addonBefore="Category name:"
            value={selectedCategory}
            disabled
          />
          <Input
            addonBefore="Sub category name:"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
          <Input
            addonBefore="Sub category URL:"
            value={subCategoryUrl}
            onChange={(e) => setSubCategoryUrl(e.target.value)}
          />
        </Space>
      </Modal>
    </div>
  );
}
