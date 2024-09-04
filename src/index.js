import dotenv from "dotenv";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import { app } from "./app.js";
import connectFirebase from "./db/index.js";

// const db = admin.firestore();

dotenv.config({
  path: "./env",
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

connectFirebase()
  .then(() => {
    app.on("error", (error) => {
      console.log("Err:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`App is running on Port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("firebase  connection failed!!", err));
