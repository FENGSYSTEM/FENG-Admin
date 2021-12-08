import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosService from "src/utilities/axiosService";

import { API_ENDPOINT } from "src/constant/api";
import { message } from "antd";

export const getEvent = createAsyncThunk("getEvent", async () => {
  const res = await axiosService.get(`${API_ENDPOINT}/events`, {});
  console.log(res.data);
  return res.data;
});

export const createEvent = createAsyncThunk(
  "createEvent",
  async (data: any) => {
    const res = await axiosService.post(`${API_ENDPOINT}/events`, data);
    console.log(res.data);
    return res.data;
  }
);

export const deleteEvent = createAsyncThunk("deleteEvent", async () => {
  const res = await axiosService.delete(`${API_ENDPOINT}/events`, {});
  console.log(res.data);
  return res.data;
});

const initialState = {
  eventLoading: false,
  eventCreateLoading: false,
  eventDeleteLoading: false,
  eventData: null,
};

const eventSlice = createSlice({
  name: "eventSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * @getEvent
     */
    builder.addCase(getEvent.pending, (state) => {
      state.eventLoading = true;
    });
    builder.addCase(getEvent.fulfilled, (state, { payload }) => {
      state.eventLoading = false;
      state.eventData = payload;
    });
    builder.addCase(getEvent.rejected, (state) => {
      state.eventLoading = false;
    });
    /**
     * @createEvent
     */
    builder.addCase(createEvent.pending, (state) => {
      state.eventCreateLoading = true;
    });
    builder.addCase(createEvent.fulfilled, (state, { payload }) => {
      state.eventCreateLoading = false;
      message.success("Create/update event successfully");
    });
    builder.addCase(createEvent.rejected, (state) => {
      state.eventCreateLoading = false;
    });
    /**
     * @deleteEvent
     */
    builder.addCase(deleteEvent.pending, (state) => {
      state.eventDeleteLoading = true;
    });
    builder.addCase(deleteEvent.fulfilled, (state, { payload }) => {
      state.eventDeleteLoading = false;
      message.success("Delete event successfully");
    });
    builder.addCase(deleteEvent.rejected, (state) => {
      state.eventDeleteLoading = false;
    });
  },
});

export const {} = eventSlice.actions;
export default eventSlice.reducer;
