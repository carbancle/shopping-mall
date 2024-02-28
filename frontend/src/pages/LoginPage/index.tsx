import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { loginUser } from "../../store/thunkFunction";
import { ILoginUser } from "../../interface/user";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ILoginUser>({ mode: 'onChange' })

  const dispatch = useAppDispatch();

  const onSubmit = ({ email, password }: ILoginUser) => {

    const body = {
      email,
      password,
    }

    dispatch(loginUser(body));

    reset();
  }

  const userEmail = {
    required: "이메일은 필수 입력값입니다"
  }

  const userPassword = {
    required: "비밀번호는 필수 입력값입니다",
    minLength: {
      value: 6,
      message: "비밀번호는 최소 6자 이상이여야 합니다"
    }
  }

  return (
    <section className="flex flex-col justify-center mt-20 max-w-[400px] m-auto">
      <div className="p-6 bg-white rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center">
          로그인
        </h1>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label htmlFor="email"
              className="text-sm font-semibold text-black">
              Email
            </label>
            <input type="text" id="email"
              className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
              {...register('email', userEmail)}
            />
            {
              errors?.email &&
              <div>
                <span className="text-red-500">
                  {errors.email.message}
                </span>
              </div>
            }
          </div>
          <div className="mb-2">
            <label htmlFor="password"
              className="text-sm font-semibold text-black">
              Password
            </label>
            <input type="password" id="password"
              className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
              {...register('password', userPassword)}
            />
            {
              errors?.password &&
              <div>
                <span className="text-red-500">
                  {errors.password.message}
                </span>
              </div>
            }
          </div>
          <div className="mt-6">
            <button type="submit"
              className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 duration-200">
              로그인
            </button>
          </div>
          <p className="mt-8 text-xs font-light text-center text-gray-700">
            아이디가 없다면?{" "}
            <Link to={"/register"} className="font-medium hover:underline">회원가입</Link>
          </p>
        </form>
      </div>
    </section>
  )
}