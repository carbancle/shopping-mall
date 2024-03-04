import { ICartDetail } from "../../../interface/User";

export default function CartTable({ products, onRemoveItem }: { products: any, onRemoveItem: any }) {
  const renderCartImage = (images: string[]) => {
    if (images.length > 0) {
      let image = images[0];

      return `${import.meta.env.VITE_SERVER_URL}/${image}`
    }
  }

  const renderItems = (
    products.length > 0 && products.map((product: ICartDetail) => (
      <tr key={product._id}>
        <td>
          <img src={renderCartImage(product.images)} alt="product"
            className="w-[70px]"
          />
        </td>
        <td>
          {product.quantity} 개
        </td>
        <td>{product.price} 원</td>
        <td>
          <button onClick={() => onRemoveItem(product._id)}
            className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
          >지우기</button>
        </td>
      </tr>
    ))
  )

  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="border-[1px]">
        <tr>
          <th>사진</th>
          <th>개수</th>
          <th>가격</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        {renderItems}
      </tbody>
    </table>
  )
}