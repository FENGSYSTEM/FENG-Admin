import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "axios";
import { API_ENDPOINT } from "src/constant/api";

export const getListCategory = createAsyncThunk("getListCategory", async () => {
  const res = await axios.get(`${API_ENDPOINT}/categories`);
  console.log(res);
  return res.data;
});

export const getListSubCategory = createAsyncThunk(
  "getListSubCategory",
  async (subCategory: any) => {
    const res = await axios.get(`${API_ENDPOINT}/categories/${subCategory}`);
    console.log(res);
    return res.data;
  }
);

export const createSubCategory = createAsyncThunk(
  "createSubCategory",
  async (data: any) => {
    console.log(data);
    const res = await axios.post(
      `${API_ENDPOINT}/categories/subCategory`,
      data
    );
    console.log(res);
    return res.data;
  }
);

export const updateSubCategory = createAsyncThunk(
  "updateSubCategory",
  async ({ subCategoryId, data }: { subCategoryId: any; data: any }) => {
    console.log(data);
    const res = await axios.put(
      `${API_ENDPOINT}/categories/subCategory/${subCategoryId}`,
      data
    );
    console.log(res);
    return res.data;
  }
);

const initialState = {
  listCategory: [],
  listSubCategory: [],
  listCategoryLoading: false,
  listSubCategoryLoading: false,
  createSubCategoryLoading: false,
  updateSubCategoryLoading: false,
};

const categorySlice = createSlice({
  name: "categorySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @getListCategory
     */
    builder.addCase(getListCategory.pending, (state) => {
      state.listCategoryLoading = true;
    });
    builder.addCase(getListCategory.fulfilled, (state, { payload }) => {
      state.listCategoryLoading = false;
      state.listCategory = payload;
    });
    builder.addCase(getListCategory.rejected, (state) => {
      state.listCategoryLoading = false;
    });
    /**
     * @getListSubCategory
     */
    builder.addCase(getListSubCategory.pending, (state) => {
      state.listSubCategoryLoading = true;
    });
    builder.addCase(getListSubCategory.fulfilled, (state, { payload }) => {
      state.listSubCategoryLoading = false;
      state.listSubCategory = payload;
    });
    builder.addCase(getListSubCategory.rejected, (state) => {
      state.listSubCategoryLoading = false;
    });
    /**
     * @createSubCategory
     */
    builder.addCase(createSubCategory.pending, (state) => {
      state.createSubCategoryLoading = true;
    });
    builder.addCase(createSubCategory.fulfilled, (state, { payload }) => {
      state.createSubCategoryLoading = false;
      message.info("create sub category success !");
    });
    builder.addCase(createSubCategory.rejected, (state) => {
      state.createSubCategoryLoading = false;
    });
    /**
     * @updateSubCategory
     */
    builder.addCase(updateSubCategory.pending, (state) => {
      state.updateSubCategoryLoading = true;
    });
    builder.addCase(updateSubCategory.fulfilled, (state, { payload }) => {
      state.updateSubCategoryLoading = false;
      message.info("update sub category success !");
    });
    builder.addCase(updateSubCategory.rejected, (state) => {
      state.updateSubCategoryLoading = false;
    });
  },
});

export const {} = categorySlice.actions;
export default categorySlice.reducer;
