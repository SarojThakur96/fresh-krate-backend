import dotenv from "dotenv";
import { app } from "./app.js";
import connectFirebase from "./db/index.js";

dotenv.config({
  path: "./env",
});

// connectFirebase()
//   .then(() => {
//     app.on("error", (error) => {
//       console.log("Err:", error);
//       throw error;
//     });
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`App is running on Port ${process.env.PORT}`);
//     });
//   })
//   .catch((err) => console.log("firebase  connection failed!!", err));
app.listen(process.env.PORT || 8000, () => {
  console.log(`App is running on Port ${process.env.PORT}`);
});
