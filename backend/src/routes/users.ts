import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";

process.env.JWT_SECRET;

const router = Router();

router.get("/auth", auth, async (req: Request, res: Response, next) => {
  return res.status(200).json({
    id: req.currentUser._id,
    email: req.currentUser.email,
    name: req.currentUser.name,
    role: req.currentUser.role,
    image: req.currentUser.image,
    cart: req.currentUser.cart,
    history: req.currentUser.history,
  });
});

router.post("/register", async (req: Request, res: Response, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req: Request, res: Response, next) => {
  try {
    // 존재하는 유저인지 체크
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("Auth failed, email not found");
    }

    // 비밀번호가 일치하는지 체크
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }

    const payload = {
      // mongodb의 ID 값은 object로 되어있어 string 값으로 변경
      userId: user._id.toHexString(),
    };
    // token 생성
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET 가 존재하지 않습니다");
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ user, accessToken });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", auth, async (req: Request, res: Response, next) => {
  try {
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
});

// export default router 사용시 typeError 발생
module.exports = router;
