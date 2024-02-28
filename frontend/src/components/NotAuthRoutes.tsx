import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { IAuthStatus } from "../layout/Layout";

export default function NotAuthRoutes() {
  const isAuth: IAuthStatus = useOutletContext();
  return (
    isAuth ? <Navigate to={"/"} /> : <Outlet />
  )
}