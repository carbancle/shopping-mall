import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { logoutUser } from "../../../store/thunkFunction";

const routes = [
  { id: '0', to: "/login", name: "로그인", auth: false },
  { id: '1', to: "/register", name: "회원가입", auth: false },
  { id: '2', to: "", name: "로그아웃", auth: true },
]

export default function NavItem(mobile: any) {
  const isAuth = useAppSelector(state => state.user?.isAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login");
  }

  return (
    <ul className={`text-md justify-center w-full flex gap-4 ${mobile && "flex-col bg-gray-900 h-full"} items-center`}>
      {routes.map(({ id, to, name, auth }) => {
        if (isAuth !== auth) return null;

        if (name === "로그아웃") {
          return (
            <li key={id} className="py-2 text-center border-b-4 cursor-pointer">
              <Link onClick={handleLogout} to={""}>
                {name}
              </Link>
            </li>
          )
        } else {
          return (
            <li key={id} className="py-2 text-center border-b-4 cursor-pointer">
              <Link to={to}>
                {name}
              </Link>
            </li>
          )
        }
      })}
    </ul>
  );
}
