import { Router, Request, Response } from "express";
import { Product } from "../models/Product";
import multer from "multer";

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

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const product = new Product(req.body);
    product.save();
    return res.sendStatus(201);
  } catch (e) {
    next(e);
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
