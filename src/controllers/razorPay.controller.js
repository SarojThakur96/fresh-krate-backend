import Razorpay from "razorpay";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };
import admin from "firebase-admin";
import { DATABASE_URL } from "../constants.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});

const db = admin.firestore();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log(
  process.env.RAZORPAY_KEY_ID,
  process.env.RAZORPAY_KEY_SECRET,
  process.env.PORT
);

const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount && !currency) {
    throw new ApiError(400, "Please provide amount and currency");
  }

  const options = {
    amount,
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { orderId: order.id },
          "order created Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating order"
    );
  }
});

const verifyOrder = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, userId } = req.body;
  if (!razorpayPaymentId && !razorpayOrderId && !userId) {
    throw new ApiError(
      400,
      "Please provide razorpayPaymentId, razorpayOrderId and userId"
    );
  }

  try {
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.status === "captured" && payment.order_id === razorpayOrderId) {
      const transactionRef = db
        .collection("transactions")
        .doc(razorpayPaymentId);
      await transactionRef.set({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        userId: userId,
        createdAt: db.FieldValue.serverTimestamp(),
      });

      return res.status(200).json(new ApiResponse(200, "payment verified"));
    } else {
      throw new ApiError(400, "Payment verification failed");
    }
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while Payment verification"
    );
  }
});

export { createOrder, verifyOrder };
