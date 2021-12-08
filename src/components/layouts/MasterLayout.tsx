import { Collapse, List } from "antd";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import React, { ReactElement } from "react";

interface Props {
  children: React.ReactElement;
}

export default function MasterLayout({ children }: Props): ReactElement {
  const router = useRouter();
  const { Panel } = Collapse;
  return (
    <div className="px-4 my-5">
      <div className="row">
        {router.asPath === "/login" ? (
          <div className="col-12">{children}</div>
        ) : (
          [
            <div className="col-2">
              {" "}
              <Collapse bordered={false} defaultActiveKey={["1"]} ghost>
                <Panel header="Product" key="1">
                  <Link href="/product">
                    <div
                      className={`menu-item ${
                        router.pathname === "/product" && "active"
                      }`}
                    >
                      Manage Product
                    </div>
                  </Link>
                </Panel>
                <Panel header="Order" key="2">
                  <Link href="/order">
                    <div
                      className={`menu-item ${
                        router.pathname === "/order" && "active"
                      }`}
                    >
                      Order List
                    </div>
                  </Link>
                  <Link href="/order/pending">
                    <div
                      className={`menu-item ${
                        router.pathname === "/order/pending" && "active"
                      }`}
                    >
                      Pending Order List
                    </div>
                  </Link>
                  <Link href="/order/processing">
                    <div
                      className={`menu-item ${
                        router.pathname === "/order/processing" && "active"
                      }`}
                    >
                      Processing Order List
                    </div>
                  </Link>
                  <Link href="/order/successful">
                    <div
                      className={`menu-item ${
                        router.pathname === "/order/successful" && "active"
                      }`}
                    >
                      Successful Order List
                    </div>
                  </Link>
                </Panel>
                <Panel header="Category" key="2">
                  <Link href="/category">
                    <div
                      className={`menu-item ${
                        router.pathname === "/category" && "active"
                      }`}
                    >
                      Category
                    </div>
                  </Link>
                </Panel>
                <Panel header="Configurations" key="3">
                  <Link href="/config/feng-content">
                    <div
                      className={`menu-item ${
                        router.pathname === "/config/feng-content" && "active"
                      }`}
                    >
                      Feng website content
                    </div>
                  </Link>
                  <Link href="/config/event">
                    <div
                      className={`menu-item ${
                        router.pathname === "/config/event" && "active"
                      }`}
                    >
                      Event
                    </div>
                  </Link>
                </Panel>
              </Collapse>
            </div>,
            <div className="col-10">{children}</div>,
          ]
        )}
      </div>
    </div>
  );
}
