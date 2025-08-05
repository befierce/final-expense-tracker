const { user, userExpense, Order } = require("../models/user");
const jwt = require("jsonwebtoken");
// const secretKey = "15s253d34dwe4ffsf3df4srr";
const secretKey = process.env.SECRET_KEY_JWT;
const sercretStripeKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(sercretStripeKey);

// console.log(stripe);
const purchasePremium = async (req, res) => {
  console.log("request arrived");
  let userid;
  const token = req.headers.authorization.split(" ")[1];
  try {
    try {
      const decoded = await jwt.verify(token, secretKey);
      console.log("decoded", decoded);
      userid = decoded.userId
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: "jwt error" });
      }
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "token expired" });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: "10000",
      currency: "inr",
    });
    console.log();
    await Order.create({
      status: "pending",
      paymentId: paymentIntent.id,
      usersListUserId:userid
    });

    const clientSecret = paymentIntent.client_secret;
    const paymentId = paymentIntent.id;
    console.log("payment intent result", { clientSecret, paymentId });
    res.json({ clientSecret, paymentId });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

const verifyPayment = async (req, res) => {
  console.log("request reached");
  const token = req.headers.authorisation.split(" ")[1];
  console.log("token token", token)
  const { order_id} = req.body;
  console.log("are re re", req.body)
  try {
    try{
      const decoded = await jwt.verify(token,secretKey)
    }catch(jwtError){
      if(jwtError instanceof jwt.JsonWebTokenError){
        res.status(400).json({message: "jwt Error"});
      }
      if(jwtError instanceof jwt.TokenExpiredError){
        res.status(400).json({message: "token expired"});
      }
    }
    const order = await Order.findOne({ where: { paymentId: order_id } });
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
        { where: { paymentId: order_id } }
      );
    }
    return res.status(200).json({ message: "Payment successfully verified" });
  } catch (err) {
    console.error("Error updating user premium status:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { purchasePremium, verifyPayment };
