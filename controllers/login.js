// const userLogIn = require('../models/user');
const { user, userExpense } = require('../models/user');

const bcrypt = require('bcrypt');


async function loginToServerController(req, res) {
    // console.log(req.body);
    const { name, email, password } = req.body;

    try {
        const userAlreadyExists = await user.findOne({
            where: {
                email: email
            }
        });
        console.log(userAlreadyExists.id);
        if (userAlreadyExists) {
            const isPasswordValid = await bcrypt.compare(password,userAlreadyExists.password);
            if (isPasswordValid) {
                return res.status(202).json({ message: 'Login!!', userId: userAlreadyExists.userId });
            } else {
                return res.status(201).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    loginToServerController
};
