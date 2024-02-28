import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/User";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // 토큰을 request headers 에서 가져오기
  const authHeader = req.headers["authorization"];

  // Bearer token
  const token = authHeader ? authHeader.split(" ")[1] : "null";
  if (token === null) return res.sendStatus(401);

  try {
    // 토큰이 유효한지 확인
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET 값이 존재하지 않습니다.");
    }
    // typescript 에서 decode의 types 확인이 필요함. 임시로 any 처리
    const decode: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode.userId });
    if (!user) {
      return res.status(400).send("존재하지 않는 유저입니다.");
    }
    // typescript 에서 resquest 의 경우 해당 값을 받는 변수에 대한 type 지정을 해야함.
    // types 폴더에 express.d.ts 파일을 생성하여 currentUser에 대한 type: User["_id"] 를 저장
    // type에 대한 정보는 생성한 user 변수의 Tyeps.ObjectId 인 것으로 보이나 확인 필요
    req.currentUser = user;
    console.log("현재 유저의 정보", req.currentUser);
    next();
  } catch (e) {
    next(e);
  }
};

export { auth };
