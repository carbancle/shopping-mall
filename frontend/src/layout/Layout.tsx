import { useEffect } from 'react';
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { authUser } from "../store/thunkFunction";

export interface IAuthStatus {
  isAuth: boolean
}

export default function Layout() {
  const isAuth = useAppSelector(state => state.user?.isAuth);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isAuth) {
      dispatch(authUser());
    }
  }, [isAuth, pathname, dispatch])

  return (
    <div className="flex flex-col h-screen justify-between">
      <ToastContainer
        position="bottom-right" theme="light" pauseOnHover autoClose={1500}
      />
      <Navbar />
      <main className="mb-auto w-10/12 max-w-4xl mx-auto">
        <Outlet context={isAuth} />
      </main>
      <Footer />
    </div>
  )
}