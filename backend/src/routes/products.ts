import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import multer from "multer";
import { SortOrder } from "mongoose";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req: Request, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage }).single("file");

router.get("/", async (req: Request, res: Response, next) => {
  // request query 값인 order 속성을 파악하지 못하여 as Type를 사용하여 타입 표명
  // 이 경우, req.query.order의 type error를 놓칠 수 있으므로 정의한 order에서 타입을 추론할 수 있도록 이중 표명함
  const order: SortOrder = req.query.order
    ? (req.query.order as SortOrder)
    : "desc";
  const sortBy = req.query.sortBy ? String(req.query.sortBy) : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;

  let findArgs: any = {};
  const filter: string[] = req.query.filters as string[];

  for (let key in filter) {
    if (filter[key].length > 0) {
      findArgs[key] = filter[key];
    }
  }

  try {
    const products = await Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);

    const productsTotal = await Product.countDocuments(findArgs);
    const hasMore = skip + limit < productsTotal ? true : false;

    return res.status(200).json({
      products,
      hasMore,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const product = new Product(req.body);
    product.save();
    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

router.post("/image", async (req: Request, res: Response, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ fileName: res.req.file?.filename });
  });
});

// export default router 사용시 typeError 발생
module.exports = router;
