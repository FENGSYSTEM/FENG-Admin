import React, { ReactElement } from "react";
import IndexOrder from "..";

interface Props {}

export default function index({}: Props): ReactElement {
  return <IndexOrder orderStatus="SUCCESSFUL" />;
}
