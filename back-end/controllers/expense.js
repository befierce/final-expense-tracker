const { user, userExpense } = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const secretKey = "15s253d34dwe4ffsf3df4srr";

exports.postExpenseDataToTheServer = async (req, res, next) => {
  try {
    const secretKey = "15s253d34dwe4ffsf3df4srr";
    const token = req.headers.authorization?.split(" ")[1];// ✅ Correct header name
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, "15s253d34dwe4ffsf3df4srr" );
    const userId = decoded.userId;

    let { id, expenseAmount, description, category } = req.body;
    let money = expenseAmount;

    // ✅ Insert into database with userId
    const result = await userExpense.create({
      id,
      userId,
      money,
      description,
      category,
    });

    res.json(result);
  } catch (err) {
    console.error("Error in postExpenseDataToTheServer:", err);
    res.status(401).json({ error: "Invalid token or failed to insert data" });
  }
};


exports.getExpenseDataFromTheServer = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await jwt.verify(token, secretKey);
    // userId = decoded.userId;
    // const isPremiumUser = await checkPremiumStatus(userId);

    // const itemsPerPage = 3;
    // const page = req.query.page || 1;
    // const offSet = (page - 1) * itemsPerPage;
    console.log("req.query", req.query);
    //console.log(offSet);
    const result = await userExpense.findAndCountAll({
      where: { userId: userId },
      // offset: offSet,
      // limit: itemsPerPage,
    });
    console.log("fetching the data from server", result)
    // res.json({ result, isPremiumUser }); 
    res.json({ result }); // Send the result to the client
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
};

async function checkPremiumStatus(userId) {
  try {
    const isUser = await user.findByPk(userId);
    // console.log("is premium",isUser.dataValues.premium);
    const isPremium = isUser.dataValues.premium;
    return isPremium;
  } catch (err) {
    console.log(err);
  }
}

exports.getSingleExpenseDataFromTheServer = (req, res, next) => {
  const id = req.params.id;
  console.log("****", id);
  userExpense
    .findOne({
      where: { id: id },
    })
    .then((userData) => {
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(userData);
      console.log(userData);
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    });
};

exports.deleteSingleExpenseDataFromTheServer = (req, res, next) => {
  const id = req.params.id;
  console.log("item delete id", id);
  userExpense
    .destroy({
      where: { id: id },
    })
    .then(() => {
      res.json({ userId: id, message: "Data deleted successfully" });
    })
    .catch((err) => {
      console.error("Error deleting data:", err);
      res.status(500).json({ error: "Error deleting data" });
    });
};
