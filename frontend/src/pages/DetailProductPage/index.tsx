import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../utils/axios";
import ProductImage from "./Sections/ProductImage";
import ProductInfo from "./Sections/ProductInfo";
import { IProduct } from "../../interface/Product";

export default function DetailProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<IProduct>();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axiosInstance.get(`/products/${productId}?type=single`)
        setProduct(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProduct();
  }, [productId])

  if (!product) return null;

  return (
    <section>
      <div className="text-center">
        <h1 className="p-4 text-2xl">{product.title}</h1>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          {/* Product image */}
          <ProductImage {...product} />
        </div>
        <div className="w-1/2">
          {/* Product Info */}
          <ProductInfo {...product} />
        </div>
      </div>
    </section>
  )
}