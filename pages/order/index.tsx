import { getListOrders } from "@redux/slices/admin/orderSlide";
import { Table } from "antd";
import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

export default function Index({}: Props): ReactElement {
  const dispatch = useDispatch();
  const listOrders = useSelector((state) => state.order.listOrders) as any;

  useEffect(() => {
    dispatch(getListOrders());
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
      title: "address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={listOrders} />
    </div>
  );
}
