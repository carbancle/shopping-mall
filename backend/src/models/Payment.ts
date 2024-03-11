import { Model, Schema, model } from "mongoose";

interface IPayment {
  user: object;
  data?: [];
  product?: [];
}

interface IPaymentMethods {}

type PaymentModel = Model<IPayment, {}, IPaymentMethods>;

const paymentSchema = new Schema<IPayment, PaymentModel, IPaymentMethods>(
  {
    user: {
      type: Object,
    },
    data: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Payment = model<IPayment, PaymentModel>("Payment", paymentSchema);

export { Payment };
