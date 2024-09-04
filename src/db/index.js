import mongoose from "mongoose";
import { DATABASE_URL } from "../constants.js";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };
import admin from "firebase-admin";

const connectFirebase = async () => {
  try {
    await admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: DATABASE_URL,
    });

    console.log(`\n firebase connected !! DB HOST`);
  } catch (error) {
    console.log("firebase connection error", error);
    process.exit(1);
  }
};

export default connectFirebase;
