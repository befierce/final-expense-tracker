const userSignUp = require('../models/signup');

async function postSignUpDataToServer(req, res) {
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
            const newUser = await userSignUp.create({ name, email, password });
            res.status(201).json({ message: 'SignUp Successful!!', user: newUser });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    postSignUpDataToServer
};
