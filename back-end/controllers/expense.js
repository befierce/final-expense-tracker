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
exports.updateSingleExpenseToTheServer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { expenseAmount, description, category } = req.body;

    const expense = await userExpense.findOne({ where: { id } });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Update the expense
    const result = await expense.update({
      money: expenseAmount || expense.money,
      description: description || expense.description,
      category: category || expense.category,
    });

    console.log("data updated - -", result);

    // Send the updated expense back to the client
    res.status(200).json({ message: "Expense updated successfully", result });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ error: "Error updating expense" });
  }
};

exports.deleteSingleExpenseDataFromTheServer = (req, res, next) => {
  console.log("delete request reached the server");
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
