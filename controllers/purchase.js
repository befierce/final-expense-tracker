    const Razorpay = require('razorpay');
    const { user, userExpense, Order } = require('../models/user')
    const jwt = require('jsonwebtoken');


    const purchasePremium = async (req, res) => {
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
            await Order.create({ orderId: order.id, usersListUserId: userid, status: 'PENDING' })
            return res.status(201).json({
                order, key_id: rzp.key_id
            })
        } catch (err) {
            console.log("i am error");
            res.status(401).json({ message: 'someth ing went wrong', error: err });
        }
    }

    const verifyPayment = async (req, res) => {
        const { order_id, payment_id } = req.body;

        try {

            const order = await Order.findOne({ where: { orderId: order_id } });
            if (!order) {
                console.error('Order not found');
                return res.status(404).json({ message: 'Order not found' });
            }
            else{
                console.log("oder exists now update it:", order.dataValues.usersListUserId);
                await user.update({ premium: true }, { where: { userId: order.dataValues.usersListUserId } });
                await Order.update({ status: 'SUCCESS' }, { where: { orderId: order_id } });
            }
            return res.status(200).json({ message: 'Payment successfully verified' })
        } catch (err) {
            console.error('Error updating user premium status:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

    }

    module.exports = { purchasePremium, verifyPayment };



