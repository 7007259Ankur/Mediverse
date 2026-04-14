import express from "express";
import {
  checkout,
  paymentVerification,
  verifyAccessCode,
} from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payment/checkout → Create Razorpay order
router.post("/checkout", checkout);

// POST /api/payment/paymentverification → Verify payment & generate access code
router.post("/paymentverification", paymentVerification);

// ✅ POST /api/payment/verify-access-code → Verify access code before AI prediction
router.post("/verify-access-code", verifyAccessCode);

export default router;
