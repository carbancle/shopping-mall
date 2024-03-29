import { IProduct } from "../../../interface/Product";
import { useAppDispatch } from "../../../store";
import { addToCart } from "../../../store/thunkFunction";

export default function ProductInfo(product: IProduct) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(addToCart({ productId: product._id }));
  }
  return (
    <section>
      <p className="text-xl text-bold">
        상품 정보
      </p>
      <ul>
        <li><span className="font-semibold text-gray-900">가격 : </span>{product.price} 원</li>
        <li><span className="font-semibold text-gray-900">팔린 갯수 : </span>{product.sold} 개</li>
        <li><span className="font-semibold text-gray-900">설명 : </span>{product.description}</li>
      </ul>
      <div className="mt-3">
        <button onClick={handleClick}
          className="w-full px-4 py-2 bg-black text-white hover:bg-gray-700 rounded-md transition-colors"
        >
          장바구니로
        </button>
      </div>
    </section>
  );
}