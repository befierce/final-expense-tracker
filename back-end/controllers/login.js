const { user, userExpense } = require("../models/user");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const secretKey = process.env.SECRET_KEY_JWT;

async function loginToServerController(req, res) {
  // console.log(req.body);
  const { name, email, password } = req.body;

  try {
    const userAlreadyExists = await user.findOne({
      where: {
        email: email,
      },
    });
    const premiumStatus = userAlreadyExists.dataValues.premium;
    if (userAlreadyExists) {
      const isPasswordValid = await bcrypt.compare(
        password,
        userAlreadyExists.password
      );
      if (isPasswordValid) {
        const token = jwt.sign({ userId: userAlreadyExists.userId }, secretKey); //generating token usign jwt
        console.log("token generated", token);
        return res.status(202).json({ message: "Login!!", token: token, premiumStatus:premiumStatus});
      } else {
        return res.status(201).json({ message: "Invalid password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  loginToServerController,
};
