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
