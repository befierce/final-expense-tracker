const { user, userExpense } = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const secretKey = "15s253d34dwe4ffsf3df4srr";

exports.postExpenseDataToTheServer = async (req, res, next) => {
  try {
    const secretKey = "15s253d34dwe4ffsf3df4srr";
    const token = req.headers.authorization?.split(" ")[1];
    console.log("request headers", req.body)
    console.log("token recieved", token);
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    let decoded;
    try {
      decoded = await jwt.verify(token, secretKey);
    } 
    catch (jwtError) {
      if(jwtError instanceof jwt.JsonWebTokenError){
        return res.status(401).json({error: "invalid token"});
      }
      if(jwtError instanceof jwt.TokenExpiredError){
        return res.status(401).json({error:'token expired'});
      }
      throw jwtError;
    }
    console.log("decoded data", decoded);
    const userId = decoded.userId;

    let { id, money, description, category } = req.body;
    const result = await userExpense.create({
      id,
      userId,
      money,
      description,
      category,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error("Error in postExpenseDataToTheServer:", err);
    if(err.name === 'sequelizeValidationError'){
      return res.status(400).json({
        error: "validation error",
        details: err.errors.map(e => e.message)
      });
    }
    if(err.name === 'SequelizeUniqueConstraintError'){
      return res.status(409).json({
        error: "Duplicate entry",
        details: err.errors.map(e => e.message)
      })
    }
    res.status(500).json({
       error:"server error while saving expense",
      message: err.message });
  }
};
exports.getExpenseDataFromTheServer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let userId;
    try{
      const decoded = await jwt.verify(token,secretKey);
      userId = decoded.userId;
    }catch(jwtError){
      if(jwtError instanceof jwt.JsonWebTokenError){
        res.status(401).json({message:"invalid token"})
      }
      if(jwtError instanceof jwt.TokenExpiredError){
        res.status(402).json({message:"token expired"})
      }
    }
    
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
    console.log("fetching the data from server", result);
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
