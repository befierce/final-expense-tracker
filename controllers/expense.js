// const db = require('../util/database');
const { user, userExpense } = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const secretKey = '15s253d34dwe4ffsf3df4srr';

exports.postExpenseDataToTheServer = (req, res, next) => {
    const secretKey = process.env.secretKey;
    console.log(secretKey);
    let { id, userId, money, description, category } = req.body;
    // const recievedToken = userId;
    console.log('recieved token',userId);
    jwt.verify(userId,secretKey,(err,decoded)=>{
        if(err){
            return res.status(401).json({ error: 'Token is invalid' });
        }
        else{
            console.log("decoded",decoded);
            userId = decoded.userId;
            console.log("retrieved user id:",userId);
        }
    })
    userExpense.create({
        id: id,
        userId: userId, 
        money: money,
        description: description,
        category: category
    })
    .then((result) => {
        const responseData = result.toJSON(); // Convert the result to JSON
        res.json(responseData);
    })
    .catch((err) => {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data' });
    });
}

exports.getExpenseDataFromTheServer = (req, res, next) => {
    let userId = req.params.userId;
    // console.log(userId);
    jwt.verify(userId,secretKey,(err,decoded)=>{
        if(err){
            // console.log('err');
            return res.status(401).json({ error: 'Token is invalid' });
        }
        else{
            console.log("decoded",decoded);
            userId = decoded.userId;
            console.log("retrieved user id:",userId);
        }
    })
    userExpense.findAll({where:{userId:userId}})
        .then((result) => {
            console.log(result);
            res.json(result); // Send the result to the client
        })
        .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        });
}

exports.getSingleExpenseDataFromTheServer = (req, res, next) => {
    const id = req.params.id;
    console.log('****',id);
    userExpense.findOne({
        where:{id:id}
    })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(userData);
            console.log(userData)
        })
        .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        });
}

exports.deleteSingleExpenseDataFromTheServer = (req, res, next) => {
    const id = req.params.id;
    console.log("item delete id",id);
    userExpense.destroy({
        where: { id: id }
    })
    .then(() => {
        res.json({ userId: id, message: 'Data deleted successfully' });
    })
    .catch((err) => {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Error deleting data' });
    });
}
