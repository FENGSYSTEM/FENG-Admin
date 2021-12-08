import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { API_ENDPOINT } from "src/constant/api";
import axiosService from "src/utilities/axiosService";

export const getConfig = createAsyncThunk("getConfig", async () => {
  const res = await axiosService.get(`${API_ENDPOINT}/configs`, {});
  console.log(res.data);
  return res.data;
});

export const createConfig = createAsyncThunk(
  "createConfig",
  async (data: any) => {
    const res = await axiosService.post(`${API_ENDPOINT}/configs`, data);
    console.log(res.data);
    return res.data;
  }
);

const initialState = {
  getConfigLoading: false,
  createConfigLoading: false,
  configData: null,
};

const configContentSlice = createSlice({
  name: "configContentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @getConfig
     */
    builder.addCase(getConfig.pending, (state) => {
      state.getConfigLoading = true;
    });
    builder.addCase(getConfig.fulfilled, (state, { payload }) => {
      state.getConfigLoading = false;
      state.configData = payload;
    });
    builder.addCase(getConfig.rejected, (state) => {
      state.getConfigLoading = false;
    });
    /**
     * @createConfig
     */
    builder.addCase(createConfig.pending, (state) => {
      state.createConfigLoading = true;
    });
    builder.addCase(createConfig.fulfilled, (state, { payload }) => {
      state.createConfigLoading = false;
      message.success("Create/update feng config successfully");
    });
    builder.addCase(createConfig.rejected, (state) => {
      state.createConfigLoading = false;
    });
  },
});

export const {} = configContentSlice.actions;
export default configContentSlice.reducer;
