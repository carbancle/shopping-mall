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

router.post("/cart", auth, async (req: Request, res: Response, next) => {
  try {
    // User Collection에 해당 유저의 정보를 가져오기
    const userInfo = await User.findOne({ _id: req.currentUser._id });

    // 가져온 정보에서 카트에 넣으려 하는 상품이 이미 존재하는지 확인
    let duplicate = false;
    userInfo?.cart?.forEach((item: any) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      // 상품이 이미 존재한다면
      const user = await User.findOneAndUpdate(
        { _id: req.currentUser._id, "cart.id": req.body.productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true }
      );
      return res.status(201).send(user?.cart);
    } else {
      // 상품이 존재하지 않는 경우
      const user = await User.findOneAndUpdate(
        { _id: req.currentUser._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              data: Date.now(),
            },
          },
        },
        { new: true }
      );

      return res.status(201).send(user?.cart);
    }
  } catch (e) {
    next(e);
  }
});

// export default router 사용시 typeError 발생
module.exports = router;
