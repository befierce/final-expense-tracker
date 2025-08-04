const jwt = require("jsonwebtoken");
const { Parser } = require("json2csv");
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
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const verified = jwt.verify(token, secretKey);
  console.log(verified);
  if (!verified) {
    return res.status(400).json(message, "token not verified");
  }
  const userId = verified.userId;
  try {
    const expenses = await userExpense.findAll({ where: { userId: userId } });
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "no expenses found" });
    }

    const plainExpenses = expenses.map((exp) => exp.toJSON());
    // console.log("expenses of user",plainExpenses);

    //conveting to .csv
    const fields = ["money", "description", "category"];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(plainExpenses);
    const filename = `Expense-${userId}-${Date.now()}.csv`;
    res.setHeader("Content-Disposition",`attachment: filename=${filename}`);
    res.setHeader("Content-Type","text/csv");
    res.send(csvData);
    // console.log("csv file data", csvData);
  } catch (error) {
    console.log("error in sendig file", error);
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
