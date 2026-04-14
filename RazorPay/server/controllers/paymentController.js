import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";

// ✔️ Create a new Razorpay order
export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100), // Razorpay expects amount in paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ success: false, message: "Checkout Failed" });
  }
};

// ✔️ Verify the Razorpay payment signature and save payment with 4-digit access code
export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const accessCode = Math.floor(1000 + Math.random() * 9000).toString();

      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        accessCode,
      });

      return res.redirect(`https://voluble-strudel-67099c.netlify.app/paymentsuccess?accessCode=${accessCode}`);
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment Signature Verification Failed",
      });
    }
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Finalized: Controller to verify access code before AI Predictor usage
export const verifyAccessCode = async (req, res) => {
  try {
    const { accessCode } = req.body; // ✅ Expecting in BODY

    if (!accessCode) {
      return res.status(400).json({ success: false, message: "Access code required" });
    }

    const payment = await Payment.findOne({ accessCode });

    if (payment) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Invalid access code or payment not found" });
    }
  } catch (error) {
    console.error("❌ Access Code Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
