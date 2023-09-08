const Razorpay = require('razorpay');
const { user, userExpense, Order } = require('../models/user')
// require('dotenv').config();
const jwt = require('jsonwebtoken');


const purchasePremium = async (req, res) => {
   // console.log(req.headers.authorisation);
    let userid;
    jwt.verify(req.headers.authorisation, '15s253d34dwe4ffsf3df4srr', (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: false });
        }
        else {
            userid = decoded.userId;
        }
    })
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,

            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 25000;
        const createOrder = () => {
            return new Promise((resolve, reject) => {
                rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
                    if (err) {
                        console.log('i am coming');
                        reject(err);
                    } else {
                        resolve(order);
                    }
                });
            });
        };
        const order = await createOrder();
        // console.log("orderid",order.id);
        console.log("ordershorder",order);
        await Order.create({ orderId: order.id, usersListUserId: userid, status: 'PENDING' })
            return res.status(201).json({
                order, key_id: rzp.key_id
            })  
        }catch (err) {
            console.log("i am error");
            res.status(401).json({ message: 'something went wrong', error: err });
        }
    }
module.exports = { purchasePremium };



