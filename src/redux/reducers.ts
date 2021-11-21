import { combineReducers } from "redux";

import counter from "@redux/slices/counter";
import productSlide from "./slices/admin/productSlide";
import orderSlide from "./slices/admin/orderSlide";

const rootReducer = combineReducers({
  counter,
  product: productSlide,
  order: orderSlide,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
