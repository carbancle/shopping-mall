import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../utils/axios";
import { ICartItem, ILoginUser, IRegisterUser } from "../interface/User";
import { IProduct } from "../interface/Product";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData: IRegisterUser, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/register`, userData);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData: ILoginUser, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/login`, userData);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const authUser = createAsyncThunk(
  "user/authUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/users/auth`);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/logout`);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "user/addToCart",
  async (body: object, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/users/cart`, body);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const getCartItems = createAsyncThunk(
  "user/getCartItems",
  async ({ cartItemIds, userCart }: any, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/products/${cartItemIds}?type=array`
      );

      userCart.forEach((cartItem: ICartItem) => {
        response.data.forEach((productDetail: IProduct, index: number) => {
          if (cartItem.id === productDetail._id) {
            response.data[index].quantity = cartItem.quantity;
          }
        });
      });

      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "user/removeCartItem",
  async (productId: string, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(
        `/users/cart?productId=${productId}`
      );

      response.data.cart.forEach((cartItem: ICartItem) => {
        response.data.productInfo.forEach(
          (product: IProduct, index: number) => {
            if (cartItem.id === product._id) {
              response.data.productInfo[index].quantity = cartItem.quantity;
            }
          }
        );
      });

      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);

export const payProducts = createAsyncThunk(
  "user/payProducts",
  async (body: object, thunkAPI) => {
    try {
      console.log("전달받은 body 정보? ", body);
      const response = await axiosInstance.post(`/users/payment`, body);

      console.log("상품 결제시 response 정보", response);
      return response.data;
    } catch (err: any) {
      console.log(err);
      return thunkAPI.rejectWithValue(err.response.data || err.message);
    }
  }
);
