export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
  image?: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ICartItem {
  id: string;
  quantity: number;
}
