import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"

export default function ImageSlider({ images }: { images: any }) {
  return (
    <Carousel autoPlay showThumbs={false} infiniteLoop>
      {images.map((image: string) =>
        <div key={image}>
          {import.meta.env.PROD &&
            <img
              className="w-full max-h-[150px]"
              src={`${image}`}
              alt={image}
            />
          }
          {import.meta.env.DEV &&
            <img
              className="w-full max-h-[150px]"
              src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
              alt={image}
            />
          }
          {/* <p className="legend">Legend 1</p> */}
        </div>
      )}
    </Carousel>
  )
}