const userSignUp = require('../models/user');
const bcrypt = require('bcrypt');



async function signUpToTheServerController(req, res) {
    console.log(req.body);
    const { name, email, password } = req.body;

    try {
        const alreadyExists = await userSignUp.findOne({
            where: {
                email: email
            }
        });

        if (alreadyExists) {
            return res.status(202).json({ message: 'User already exists' });
        }

        else {
            bcrypt.hash(password, 10, async (err, hash) => {
                console.log(err);
                const newUser = await userSignUp.create({ name, email, password: hash });
                // console.log("newUser",newUser);
                res.status(201).json({ message: 'SignUp Success!!', user: newUser });
            });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    signUpToTheServerController
};
