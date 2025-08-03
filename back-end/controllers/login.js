const { user, userExpense } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = process.env.SECRET_KEY_JWT;

async function loginToServerController(req, res) {
  const { name, email, password } = req.body;

  try {
    const userAlreadyExists = await user.findOne({
      where: { email },
    });

    if (!userAlreadyExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userAlreadyExists.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: userAlreadyExists.userId }, secretKey);
    const premiumStatus = userAlreadyExists.dataValues.premium;

    console.log("token generated", token);

    return res.status(200).json({
      message: "Login successful",
      token,
      premiumStatus,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  loginToServerController,
};
