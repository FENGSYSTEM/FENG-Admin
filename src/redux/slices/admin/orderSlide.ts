import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINT } from "src/constant/api";
import axiosService from "src/utilities/axiosService";
import { message } from "antd";

export const getListOrders = createAsyncThunk(
  "getListOrder",
  async (orderStatus: any) => {
    const res = await axios.get(`${API_ENDPOINT}/orders`, {
      params: {
        orderStatus,
      },
    });
    console.log(res.data);
    return res.data;
  }
);

export const updateOrder = createAsyncThunk(
  "updateOrder",
  async ({ id, status }: { id: any; status: any }) => {
    console.log({ id, status });
    const res = await axios.put(`${API_ENDPOINT}/orders/${id}`, status);
    return res;
  }
);

const initialState = {
  listOrders: null,
  listOrdersLoading: false,
  updateOrderLoading: false,
};

const orderSlide = createSlice({
  name: "orderSlide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @getListOrders
     */
    builder.addCase(getListOrders.pending, (state) => {
      state.listOrdersLoading = true;
    });
    builder.addCase(getListOrders.fulfilled, (state, { payload }) => {
      state.listOrdersLoading = false;
      state.listOrders = payload;
    });
    builder.addCase(getListOrders.rejected, (state) => {
      state.listOrdersLoading = false;
    });
    /**
     * @updateOrder
     */
    builder.addCase(updateOrder.pending, (state) => {
      state.updateOrderLoading = true;
    });
    builder.addCase(updateOrder.fulfilled, (state, { payload }) => {
      state.updateOrderLoading = false;
      message.success("Order status updated !");
    });
    builder.addCase(updateOrder.rejected, (state) => {
      state.updateOrderLoading = false;
    });
  },
});

export const {} = orderSlide.actions;
export default orderSlide.reducer;
