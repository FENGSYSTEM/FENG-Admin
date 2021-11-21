import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINT } from "src/constant/api";
import axiosService from "src/utilities/axiosService";
import { message } from "antd";

export const getListOrders = createAsyncThunk("getListOrder", async () => {
  const res = await axios.get(`${API_ENDPOINT}/orders`);
  console.log(res.data);
  return res.data;
});

const initialState = {
  listOrders: null,
  listOrdersLoading: false,
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
  },
});

export const {} = orderSlide.actions;
export default orderSlide.reducer;
