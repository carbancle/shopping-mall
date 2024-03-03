import { useEffect, useState } from "react";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { IProduct } from "../../../interface/Product";

export default function ProductImage(product: IProduct) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      let images: any = [];

      product.images.map((imageName: string) => {
        return images.push({
          original: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
          thumbnail: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
        })
      })
      setImages(images);
    }
  }, [product])



  return (
    <ReactImageGallery items={images} />
  );
}