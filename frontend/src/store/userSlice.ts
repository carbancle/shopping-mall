import { createSlice } from "@reduxjs/toolkit";
import { authUser, loginUser, logoutUser, registerUser } from "./thunkFunction";
import { toast } from "react-toastify";

const initialState = {
  userData: {
    id: "",
    email: "",
    name: "",
    role: 0,
    image: "",
  },
  isAuth: false,
  isLoading: false,
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        toast.info("회원가입에 성공하였습니다.");
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        // state, action 에 대한 type 구분하는 방법 확인 필요
        // action.payload 호출시 정상적으로 정보 확인되지 않음..
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuth = true;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // auth
      .addCase(authUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isAuth = true;
      })
      .addCase(authUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuth = false;
        localStorage.removeItem("accessToken");
      })
      // logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.userData = initialState.userData;
        state.isAuth = false;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default userSlice.reducer;
