import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { IAuthStatus } from "../layout/Layout";

export default function ProtectedRoutes() {
  const isAuth: IAuthStatus = useOutletContext();
  // console.log("보안페이지에서 Auth값?", isAuth);
  return (
    isAuth ? <Outlet /> : <Navigate to={'/login'} />
  )
}