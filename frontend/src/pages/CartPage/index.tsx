import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getCartItems, payProducts, removeCartItem } from "../../store/thunkFunction";
import CartTable from "./Sections/CartTable";
import { ICartDetail } from "../../interface/User";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user?.userData);
  const cartDetail = useAppSelector((state) => state.user?.cartDetail);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cartItemIds: any = [];

    if (userData?.cart && userData.cart.length > 0) {
      userData.cart.forEach((item: any) => {
        cartItemIds.push(item.id);
      })

      const body = {
        cartItemIds,
        userCart: userData.cart,
      }
      dispatch(getCartItems(body));
    }
  }, [dispatch, userData])

  const calculateTotal = (cartItems: Array<ICartDetail>) => {
    let total = 0;

    cartItems.map((item) => total += item.price * item.quantity);
    setTotal(total);
  }
  useEffect(() => {
    if (cartDetail) {
      calculateTotal(cartDetail);
    }
  }, [cartDetail])

  const handleRemoveCartItem = (productId: string) => {
    dispatch(removeCartItem(productId));
  }

  const handlePaymentClick = () => {
    dispatch(payProducts({ cartDetail }));
  }

  return (
    <section>
      <div className="text-center m-7">
        <h2 className="text-2xl">나의 장바구니</h2>
      </div>
      {cartDetail && cartDetail.length > 0 ?
        (
          <>
            <CartTable products={cartDetail} onRemoveItem={handleRemoveCartItem} />
            <div className="mt-10">
              <p><span className="font-bold">합계: </span>{total} 원</p>
              <button onClick={handlePaymentClick}
                className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
              >
                결제하기
              </button>
            </div>
          </>
        ) : (
          <p>장바구니가 비었습니다</p>
        )
      }
    </section>
  )
}