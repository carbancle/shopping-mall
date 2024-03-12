import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("mongo url not defined");
    }
    const connected = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected: ${connected.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
