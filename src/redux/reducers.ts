import { combineReducers } from "redux";

import counter from "@redux/slices/counter";
import productSlide from "./slices/admin/productSlice";
import orderSlide from "./slices/admin/orderSlice";
import categorySlice from "./slices/admin/categorySlice";

const rootReducer = combineReducers({
  counter,
  product: productSlide,
  order: orderSlide,
  category: categorySlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
