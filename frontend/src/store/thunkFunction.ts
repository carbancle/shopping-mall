import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axios";
import { ILoginUser, IRegisterUser } from "../interface/User";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData: IRegisterUser, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/register`, userData);
      return response.data;
    } catch (e: any) {
      console.log(e);
      return thunkAPI.rejectWithValue(e.response.data || e.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData: ILoginUser, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/login`, userData);
      return response.data;
    } catch (e: any) {
      console.log(e);
      return thunkAPI.rejectWithValue(e.response.data || e.message);
    }
  }
);

export const authUser = createAsyncThunk(
  "user/authUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/users/auth`);
      return response.data;
    } catch (e: any) {
      console.log(e);
      return thunkAPI.rejectWithValue(e.response.data || e.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/logout`);
      return response.data;
    } catch (e: any) {
      console.log(e);
      return thunkAPI.rejectWithValue(e.response.data || e.message);
    }
  }
);
