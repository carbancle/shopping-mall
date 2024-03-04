import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { logoutUser } from "../../../store/thunkFunction";
import { AiOutlineShoppingCart } from "react-icons/ai";

const routes = [
  { to: "/login", name: "로그인", auth: false },
  { to: "/register", name: "회원가입", auth: false },

  { to: "/product/upload", name: "업로드", auth: true },
  { to: "/user/cart", name: "장바구니", auth: true, icon: <AiOutlineShoppingCart style={{ fontSize: '1.4rem' }} /> },

  { to: "", name: "로그아웃", auth: true },
  { to: "/history", name: "주문내역", auth: true },
]

export default function NavItem({ mobile }: { mobile?: true }) {
  const isAuth = useAppSelector(state => state.user?.isAuth);
  const cart = useAppSelector(state => state.user?.userData?.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate("/login");
  }

  return (
    <ul className={`text-md justify-center w-full flex gap-4 ${mobile && "flex-col bg-gray-900 h-full"} items-center`}>
      {routes.map(({ to, name, auth, icon }) => {
        if (isAuth !== auth) return null;

        if (name === "로그아웃") {
          return (
            <li key={name} className="py-2 text-center border-b-4 cursor-pointer">
              <Link onClick={handleLogout} to={""}>
                {name}
              </Link>
            </li>
          )
        } else if (icon) {
          return (
            <li key={name} className="relative py-2 text-center border-b-4 cursor-pointer">
              <Link to={to}>
                {icon}
                <span className="absolute top-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -right-3">
                  {cart ? cart.length : "0"}
                </span>
              </Link>
            </li>
          )
        } else {
          return (
            <li key={name} className="py-2 text-center border-b-4 cursor-pointer">
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
