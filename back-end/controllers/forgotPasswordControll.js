const {
  user,
  userExpense,
  Order,
  sequelize,
  forgotPasswordRequests,
} = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { where } = require("sequelize");

exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const userInDb = await user.findOne({
    where: {
      email: email,
    },
  });
  if (!userInDb) {
    return res.status(404).json({ message: "user not found" });
  }
  const { userId } = userInDb.dataValues;

  await forgotPasswordRequests.destroy({
    where: {
      usersListUserId: userId,
    },
  });
  const myUUID = uuidv4();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await forgotPasswordRequests.create({
    uuid: myUUID,
    expiresAt: expiresAt,
    isActive: true,
    usersListUserId: userId,
  });
  const resetLink = `http://localhost:5173/resetPassword/${myUUID}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Reset Your Password",
    html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password. This link is valid for 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
  };
  try {
    const response = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "password reset link sent to your email",
    });
  } catch (emailError) {
    await forgotPasswordRequests.destroy({
      where: { uuid: uuid },
    });
    return res.status(500).json({
      success: false,
      message: "Failed to send reset email please try again later",
    });
  }
};


exports.changePasswordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const uuid = req.params.uuid;
    console.log("new password and uuid", newPassword, uuid);
    const result = await forgotPasswordRequests.findOne({
      where: {
        uuid: uuid,
        isActive: true,
      },
    });
    if (!result) {
      res.status(400).json({ message: "can'proceed some error" });
    }
    const id = result.dataValues.usersListUserId;
    const hash = await bcrypt.hash(newPassword, 10);
    const result1 = await user.update({ password: hash }, { where: { userId: id } });
    console.log("result after updating the password table",result1)
    if(!result){
      res.status(401).json({message:"something went wrong while updating the password"});
    }
    res.status(200).json({
      message:
        "your password is updated , now go to login page and login again",
      success: "ok",
    });
  } catch (err) {
    console.log(err);
    console.log("something went wrong while setting up new password");
    res.status(503).json("got error while updating");
  }
};
