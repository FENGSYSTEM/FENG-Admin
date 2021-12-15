import { getListOrders, updateOrder } from "@redux/slices/admin/orderSlice";
import { Button, Input, Modal, Select, Space, Table } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

interface Props {
  orderStatus?: any;
}

export default function IndexOrder({ orderStatus }: Props): ReactElement {
  const dispatch = useDispatch();
  const { Option } = Select;
  const listOrders = useSelector((state) => state.order.listOrders) as any;
  const [openOrderModal, setOpenOrderModal] = useState<boolean>();
  const [orderInfo, setOrderInfo] = useState<any>();
  const [orderStatusSelect, setOrderStatusSelect] = useState<any>(false);

  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    dispatch(getListOrders({ orderStatus, search: searchValue }));
  }, []);

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
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
              setOrderInfo(record);
              setOrderStatusSelect(record.status);
              setOpenOrderModal(true);
            }}
          >
            View order
          </div>
        );
      },
    },
  ];

  const columnsDetailOrder = [
    {
      title: "Product ID",
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
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (color: string) => {
        return (
          <div className="d-flex align-items-center">
            <div
              className="mx-2"
              style={{
                width: "20px",
                height: "20px",
                background: color,
                border: "2px solid #000",
              }}
            />
            <div>{color}</div>
          </div>
        );
      },
    },
  ];

  const handleUpdateOrderStatus = async (id: any) => {
    console.log(id);
    await dispatch(
      updateOrder({
        id: id,
        status: {
          status: orderStatusSelect,
        },
      })
    );
    await setOpenOrderModal(false);
    await dispatch(getListOrders(orderStatus));
  };

  useEffect(() => {
    dispatch(getListOrders({ orderStatus, search: searchValue }));
  }, [searchValue]);
  return (
    <div>
      <Input
        className="mb-3"
        value={searchValue}
        placeholder="Search customer name, phone number..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Table columns={columns} dataSource={listOrders} />
      <Modal
        title={`View order - ID: ${orderInfo?.id}`}
        style={{ top: 20 }}
        visible={openOrderModal}
        onOk={() => handleUpdateOrderStatus(orderInfo?.id)}
        onCancel={() => setOpenOrderModal(false)}
        centered
        width={650}
      >
        <div className="w-100">
          <Space direction="vertical" className="w-100" size="middle">
            <Input
              addonBefore="Customer name:"
              value={orderInfo?.name}
              disabled
            />
            <Input
              addonBefore="Customer email:"
              value={orderInfo?.email}
              disabled
            />
            <Input
              addonBefore="Customer phone:"
              value={orderInfo?.phone}
              disabled
            />
            <Input
              addonBefore="Customer address:"
              value={orderInfo?.address}
              disabled
            />
            <Input
              addonBefore="Total price:"
              value={orderInfo?.totalPrice}
              disabled
            />
            <Input
              addonBefore="Payment type:"
              value={orderInfo?.paymentType}
              disabled
            />
            <Input
              addonBefore="Created at:"
              value={moment(orderInfo?.createdAt)
                .format("HH:SS - YYYY/MM/DD ")
                .toString()}
              disabled
            />
            <div className="w-100">
              <Space direction="vertical" className="w-100" size="middle">
                <Table
                  columns={columnsDetailOrder}
                  dataSource={orderInfo?.products}
                  pagination={false}
                />
              </Space>
            </div>
            <Input addonBefore="Note:" value={orderInfo?.note} disabled />
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div>Order status:</div>
              <Select
                className="mr-2"
                placeholder="select category"
                value={orderStatusSelect}
                style={{ width: 150 }}
                onChange={async (e) => {
                  setOrderStatusSelect(e);
                }}
              >
                <Option value="PENDING">PENDING</Option>
                <Option value="PROCESSING">PROCESSING</Option>
                <Option value="SUCCESSFUL">SUCCESSFUL</Option>
                <Option value="REJECT">REJECT</Option>
              </Select>
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  );
}
