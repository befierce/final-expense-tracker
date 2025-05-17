const { user, userExpense, Order } = require("../models/user");
const jwt = require("jsonwebtoken");
const secretKey = "15s253d34dwe4ffsf3df4srr";
const sercretStripeKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(sercretStripeKey);

// console.log(stripe);
const purchasePremium = async (req, res) => {

  console.log("request arrived")
  let userid;
  const token = req.headers.authorization.split(" ")[1];
  try {
    try {
      const decoded = await jwt.verify(token, secretKey);
      console.log("decoded");
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: "jwt error" });
      }
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "token expired" });
      }
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount:"10000",
      currency: "inr",
    })

    const clientSecret = paymentIntent.client_secret;
    const paymentId = paymentIntent.id;
    console.log("payment intent result", {clientSecret,paymentId});
    res.json({clientSecret,paymentId});

  } catch (error) {
      console.log("error", error);
      res.status(500).json({message:"internal server error"})
  }
};

const verifyPayment = async (req, res) => {
  const { order_id, payment_id } = req.body;

  try {
    const order = await Order.findOne({ where: { orderId: order_id } });
    if (!order) {
      console.error("Order not found");
      return res.status(404).json({ message: "Order not found" });
    } else {
      console.log(
        "oder exists now update it:",
        order.dataValues.usersListUserId
      );
      await user.update(
        { premium: true },
        { where: { userId: order.dataValues.usersListUserId } }
      );
      await Order.update(
        { status: "SUCCESS" },
        { where: { orderId: order_id } }
      );
    }
    return res.status(200).json({ message: "Payment successfully verified" });
  } catch (err) {
    console.error("Error updating user premium status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { purchasePremium, verifyPayment };
