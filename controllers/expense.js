const { user, userExpense } = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const secretKey = '15s253d34dwe4ffsf3df4srr';

exports.postExpenseDataToTheServer = (req, res, next) => {
    const secretKey = '15s253d34dwe4ffsf3df4srr';
     let { id, money, description, category } = req.body;

    jwt.verify(req.headers.authorisation,secretKey,(err,decoded)=>{
        // console.log(decoded);
        if(err){
            console.log(decoded);
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


exports.getExpenseDataFromTheServer = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        // Verify the JWT token
        const decoded = await jwt.verify(userId, secretKey);

        // Extract userId from the decoded token
        userId = decoded.userId;

        // Check premium status
        const isPremiumUser = await checkPremiumStatus(userId);

        console.log("****", isPremiumUser);

        // Fetch user expenses
        const result = await userExpense.findAll({ where: { userId: userId } });

        console.log(result);
        res.json({ result, isPremiumUser }); // Send the result to the client
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Error fetching data' });
    }
}

// exports.getExpenseDataFromTheServer = (req, res, next) => {
//     let userId = req.params.userId;
//     // console.log(userId);
//     jwt.verify(userId,secretKey,(err,decoded)=>{
//         if(err){
//             // console.log('err');
//             return res.status(401).json({ error: 'Token is invalid' });
//         }
//         else{
//             // console.log("decoded",decoded);
//             userId = decoded.userId;
//             // console.log("retrieved user id:",userId);
//         }
//     })

//     const isPremiumUser = checkPremiumStatus(userId);
//     console.log("****",isPremiumUser)
//     userExpense.findAll({where:{userId:userId}})
//         .then((result) => {
//             console.log(result);
//             res.json({result, isPremiumUser}); // Send the result to the client
//         })
//         .catch((err) => {
//             console.error('Error fetching data:', err);
//             res.status(500).json({ error: 'Error fetching data' });
//         });
// }
async function checkPremiumStatus(userId){
    try{
        const isUser = await user.findByPk(userId)
       // console.log("is premium",isUser.dataValues.premium);
        const isPremium =  isUser.dataValues.premium;
        return isPremium;
    }
    catch(err){
        console.log(err);
    }
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
