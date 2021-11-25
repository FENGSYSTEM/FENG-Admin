import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_ENDPOINT } from "src/constant/api";
import axiosService from "src/utilities/axiosService";
import { message } from "antd";

export const getListProduct = createAsyncThunk(
  "getListProduct",
  async (filter: any) => {
    const res = await axios.get(`${API_ENDPOINT}/products`, {
      params: filter,
    });
    console.log(res.data.products);
    return res.data.products;
  }
);

export const getListProductBySub = createAsyncThunk(
  "getListProductBySub",
  async (subCategoryId: number) => {
    const res = await axios.get(`${API_ENDPOINT}/products`, {
      params: {
        subCategoryId,
      },
    });
    console.log(res.data.products);
    return res.data.products;
  }
);

export const createProduct = createAsyncThunk(
  "createProduct",
  async (data: any) => {
    console.log(data);
    const res = await axiosService.post(`${API_ENDPOINT}/products`, data);
    console.log(res);
  }
);

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async ({ data, id }: { data: any; id: any }) => {
    console.log(data);
    const res = await axiosService.put(`${API_ENDPOINT}/products/${id}`, data);
    console.log(res);
  }
);

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (productId: any) => {
    const res = await axiosService.delete(
      `${API_ENDPOINT}/products/${productId}`,
      {}
    );
    console.log(res);
  }
);

const initialState = {
  listProduct: null,
  listProductLoading: false,
  createProductLoading: false,
  deleleProductLoading: false,
  updateProductLoading: false,
};

const productSlide = createSlice({
  name: "productSlide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @getListProduct
     */
    builder.addCase(getListProduct.pending, (state) => {
      state.listProductLoading = true;
    });
    builder.addCase(getListProduct.fulfilled, (state, { payload }) => {
      state.listProductLoading = false;
      state.listProduct = payload;
    });
    builder.addCase(getListProduct.rejected, (state) => {
      state.listProductLoading = false;
    });
    /**
     * @getListProductBySub
     */
    builder.addCase(getListProductBySub.pending, (state) => {
      state.listProductLoading = true;
    });
    builder.addCase(getListProductBySub.fulfilled, (state, { payload }) => {
      state.listProductLoading = false;
      state.listProduct = payload;
    });
    builder.addCase(getListProductBySub.rejected, (state) => {
      state.listProductLoading = false;
    });
    /**
     * @createProduct
     */
    builder.addCase(createProduct.pending, (state) => {
      state.createProductLoading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      message.success("product created successfully !");
      state.createProductLoading = false;
    });
    builder.addCase(createProduct.rejected, (state) => {
      message.error("failed to create new product");
      state.createProductLoading = false;
    });
    /**
     * @updateProduct
     */
    builder.addCase(updateProduct.pending, (state) => {
      state.updateProductLoading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
      message.success("update product successfully !");
      state.updateProductLoading = false;
    });
    builder.addCase(updateProduct.rejected, (state) => {
      message.error("failed to create new product");
      state.updateProductLoading = false;
    });
  },
});

export const {} = productSlide.actions;
export default productSlide.reducer;
