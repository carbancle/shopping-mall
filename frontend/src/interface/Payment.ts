export interface IPaymentUserInfo {
  id: string;
  name: string;
  email: string;
}

export interface IPaymentProductInfo {
  dateOfPurchase: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  paymentId: string;
}

export interface ITransactionData {
  user: IPaymentUserInfo[];
  product: IPaymentProductInfo[];
}
