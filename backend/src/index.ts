import express, { Request, Response, Application, NextFunction } from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// For env File
dotenv.config();

const PORT = 8080;
const HOST = "0.0.0.0";

const app: Application = express();

// app.use("가상경로", "실제경로") 형식으로도 사용 가능
app.use(express.static(path.join(__dirname, "../uploads")));
// cross-origin resource sharing:
//프론트서버와 백엔드서버의 port가 다른 경우, cors를 활성화 하여 데이터 공유를 할 수 있도록 함
app.use(cors());
// json 요청을 읽을 수 없기 때문에, json을 받을 수 있도록 설정
app.use(express.json());

export async function connectToDataBase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("mongo url not defined");
    }
    const connected = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDb connected: ${connected.connection.host}`);
  } catch (e) {
    process.exit(1);
  }
}
connectToDataBase();

app.use("/users", require("./routes/users"));
app.use("/products", require("./routes/products"));

// error 처리, error 타입을 임시값으로 any로 설정, 추후 수정
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.send(error.message || "서버에서 에러가 발생하였습니다.");
  res.status(error.status || 500);
});

app.listen(PORT, () => {
  console.log(`${PORT}번에서 실행이 되었습니다.`);
});

// 실제 배포 후, SSR시 build 된 frontend 정보를 가져온다
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.use(express.static(path.join(__dirname, "../dist")));
