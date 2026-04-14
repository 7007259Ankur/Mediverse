import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  accessCode: {
    type: String,
    required: true,   // ✅ Required because you'll always generate this
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
