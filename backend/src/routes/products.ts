import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import multer from "multer";
import { SortOrder } from "mongoose";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, "../uploads");
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
  const term = req.query.searchTerm;

  let findArgs: any = {};
  const filter: string[] = req.query.filters as string[];

  for (let key in filter) {
    if (filter[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          // Greater then equal
          $gte: filter[key][0],
          // less then equal
          $lte: filter[key][1],
        };
      } else {
        findArgs[key] = filter[key];
      }
    }
  }

  if (term) {
    findArgs["$text"] = { $search: term };
  }

  // console.log(findArgs);

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

router.get(`/:id`, async (req: Request, res: Response, next) => {
  const type = req.query.type;
  let productIds: string | string[] = req.params.id;

  if (type === "array") {
    // 요청 값이 id = 123123, 231231, 321321 와 같이 오는 것을
    // productIds = ['123123, '231231', '321321'] 으로 바꿔준다
    let ids = productIds.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }
  // productId를 이용해서 DB에서 productId과 같은 상품의 정보를 가져온다.
  try {
    const product = await Product.find({ _id: { $in: productIds } }).populate(
      "writer"
    );

    return res.status(200).send(product);
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
