import { Model, Schema, model } from "mongoose";

interface IProduct {
  writer: Schema.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  images?: [];
  sold: number;
  continents: number;
  views: number;
}

interface IProductMethods {}

type ProductModel = Model<IProduct, {}, IProductMethods>;

const productSchema = new Schema<IProduct, ProductModel, IProductMethods>({
  writer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    maxLength: 30,
  },
  description: String,
  price: {
    type: Number,
    default: 0,
  },
  images: {
    type: Array,
    default: [],
  },
  sold: {
    type: Number,
    default: 0,
  },
  continents: {
    type: Number,
    defatult: 1,
  },
  views: {
    type: Number,
    default: 0,
  },
});

productSchema.index(
  {
    title: "text",
    description: "text",
  },
  {
    weights: {
      title: 5,
      description: 1,
    },
  }
);

const Product = model<IProduct, ProductModel>("Product", productSchema);

export { Product };
