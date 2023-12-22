const jwt = require("jsonwebtoken");
const secretKey = "15s253d34dwe4ffsf3df4srr";
const {
  user,
  userExpense,
  Order,
  sequelize,
  forgotPasswordRequests,
  Filedownloaded,
} = require("../models/user");
const AWS = require("aws-sdk");

exports.downloadExpenseController = async (req, res) => {
  console.log(req.headers);
  try {
    const decoded = jwt.verify(req.headers.authorisation, secretKey);
    console.log("token after decoding", decoded);
    userId = decoded.userId;
    const expenses = await userExpense.findAll({ where: { userId: userId } });
    console.log("result", expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expenses${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);

    await Filedownloaded.create({
      url: fileURL,
      usersListUserId: userId,
      date: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    console.log("file url reached properly", fileURL);
    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.log("error in sendig file", error);
    res.status(400).json({ error: "some error happend file is not recieved" });
  }
};

const uploadToS3 = (data, filename) => {
  return new Promise((resolve, reject) => {
    let s3bucket = new AWS.S3({
      accessKeyId: "AKIASPXESU3RKMHFQOUJ",
      secretAccessKey: "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",
    });

    var params = {
      Bucket: "newexpensesbucket",
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        console.log("something went wrong", err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};

exports.getPreviousData = async (req, res) => {
  try {
    console.log(req.headers);
    const decoded = jwt.verify(req.headers.authorisation, secretKey);
    console.log(decoded);
    const userId = decoded.userId;
    const expensesHistory = await Filedownloaded.findAll({
      where: { usersListUserId: userId },
    });
    console.log("expenses history", expensesHistory);
    res.status(200).json(expensesHistory);
  } catch (err) {
    res.status(400).json({ message: "error getting history" });
  }
};
