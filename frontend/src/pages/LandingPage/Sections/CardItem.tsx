import { Link } from "react-router-dom";
import ImageSlider from "../../../components/ImageSlider";
import { IProduct } from "../../../interface/Product";

export default function CardItem({ product }: { product: IProduct }) {
  return (
    <div className="border-[1px] border-gray-300">
      <ImageSlider images={product.images} />
      <Link to={`/product/${product._id}`}>
        <p className="p-1">{product.title}</p>
        <p className="p-1">{product.continents}</p>
        <p className="p-1 text-xs text-gray-5000">{product.price} 원</p>
      </Link>
    </div>
  )
}