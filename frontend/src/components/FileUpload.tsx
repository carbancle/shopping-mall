import Dropzone from "react-dropzone"
import { axiosInstance } from "../utils/axios";

export default function FileUpload({ images, onImageChange }: {
  images: string[],
  onImageChange: any,
}) {

  const handleDrop = async (files: any) => {
    const formData = new FormData();

    const config = {
      headers: { "content-type": "multipart/form-data" }
    }

    formData.append("file", files[0]);

    try {
      const response = await axiosInstance.post('/products/image', formData, config);
      onImageChange([...images, response.data.fileName]);
    } catch (e) {
      console.log(e);
    }
  }

  const handleDelete = (image: string) => {
    const currentIndex = images.indexOf(image);
    let newImages = [...images];
    newImages.splice(currentIndex, 1);
    onImageChange(newImages);
  }

  return (
    <div className="flex gap-4">
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}
              className="min-w-[300px] h-[300px] border flex items-center justify-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-3xl cursor-pointer">+</p>
            </div>
          </section>
        )}
      </Dropzone>
      <div className="flex-grow h-[300px] border flex items-center justify-center overflow-x-scroll overflow-y-hidden">
        {images.map((image: string) => (
          <div key={image} onClick={() => handleDelete(image)}
            className="cursor-pointer"
          >
            <img src={`${import.meta.env.VITE_SERVER_URL}/${image}`} alt={image}
              className="min-w-[300px] h-[300px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}