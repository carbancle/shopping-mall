import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../store";
import { getCartItems } from "../../store/thunkFunction";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const userData = useSelector((state: any) => state.user?.userData);
  const cartDetail = useSelector((state: any) => state.user?.cartDetail);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cartItemIds: any = [];

    if (userData && userData.cart) {
      if (userData.cart.length > 0) {
        userData.cart.forEach((item: any) => {
          cartItemIds.push(item.id);
        })

        const body = {
          cartItemIds,
          userCart: userData.cart,
        }
        dispatch(getCartItems(body));
      }
    }
  }, [dispatch, userData])

  const calculateTotal = (cartItems: any[]) => {
    console.log(cartItems);
    let total = 0;

    cartItems.map((item) => total += item.price * item.quantity);
    setTotal(total);
  }
  useEffect(() => {
    calculateTotal(cartDetail);
  }, [cartDetail])


  return (
    <section>
      <div className="text-center m-7">
        <h2 className="text-2xl">나의 장바구니</h2>
      </div>
      {cartDetail?.length > 0 ?
        (
          <div className="mt-10">
            <p><span className="font-bold">합계: </span>{total} 원</p>
            <button
              className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
            >

            </button>
          </div>
        ) : (
          <p>장바구니가 비었습니다</p>
        )
      }
    </section>
  )
}