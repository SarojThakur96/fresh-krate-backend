import { Router } from "express";
import {
  createOrder,
  verifyOrder,
} from "../controllers/razorPay.controller.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/verify-order").post(verifyOrder);

export default router;
