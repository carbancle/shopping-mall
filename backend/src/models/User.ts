import { Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: number;
  image?: string;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: {
    type: String,
    maxLength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
});

userSchema.pre("save", async function (next) {
  let user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.method(
  "comparePassword",
  async function (plainPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(plainPassword, this.password);

    return match;
  }
);

const User = model<IUser, UserModel>("User", userSchema);

export { User };
