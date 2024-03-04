import { IPaymentProductInfo } from "./../../../frontend/src/interface/Payment";
import { ICartDetail, ICartItem } from "./../../../frontend/src/interface/User";
import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";
import { Product } from "../models/Product";
import { Payment } from "../models/Payment";
import async from "async";

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
    userInfo?.cart?.forEach((item: ICartItem) => {
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
  } catch (err) {
    next(err);
  }
});

router.delete("/cart", auth, async (req: Request, res: Response, next) => {
  try {
    // cart 안에 지우려고 하는 상품을 지운다
    const userInfo = await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $pull: { cart: { id: req.query.productId } } },
      { new: true }
    );

    const cart = userInfo?.cart;
    const array = cart?.map((item: ICartItem) => {
      return item.id;
    });

    const productInfo = await Product.find({ _id: { $in: array } }).populate(
      "writer"
    );

    return res.json({
      productInfo,
      cart,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/payment", auth, async (req: Request, res: Response) => {
  // User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
  let history: Array<IPaymentProductInfo> = [];
  let transactionData: any = {};

  req.body.cartDetail.forEach((item: ICartDetail) => {
    history.push({
      dateOfPurchase: new Date().toISOString(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: crypto.randomUUID(),
    });
  });

  // Payment Collection 안에 자세한 결제 정보들 넣어주기
  transactionData.user = {
    id: req.currentUser._id,
    name: req.currentUser.name,
    email: req.currentUser.email,
  };

  transactionData.product = history;

  // [user:{}, product: {}] 으로 확인되나.. interface를 사용해서 올바르게 호출되지 않음
  // console.log("transactionData의 type 정보?", transactionData);

  // user Collection update
  await User.findOneAndUpdate(
    { _id: req.currentUser._id },
    { $push: { history: { $each: history } }, $set: { cart: [] } }
  );

  // payment Collection update
  const payment = new Payment(transactionData);
  const paymentDocs = await payment.save();

  // update product sold data
  // 결제 정보의 quantity를 가져와서 product db의 sold 값에 quantity 값을 더해준다.
  let products: Array<ICartItem> = [];
  paymentDocs.product?.forEach((item: IPaymentProductInfo) => {
    products.push({ id: item.id, quantity: item.quantity });
  });

  async.eachSeries(
    products,
    async (item: ICartItem) => {
      await Product.updateOne(
        { _id: item.id },
        {
          $inc: {
            sold: item.quantity,
          },
        }
      );
      return res.sendStatus(200);
    },
    (err) => {
      if (err) return res.status(500).send(err);
    }
  );
});

// export default router 사용시 typeError 발생
module.exports = router;
