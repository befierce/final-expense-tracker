const SendinblueApiV3Sdk = require('sib-api-v3-sdk');
const SendinblueAPIKey = process.env.SENDINBLUE_API_KEY;
const { user, userExpense, Order, sequelize } = require('../models/user')

exports.forgotPasswordController = async (req, res) => {
    try {
        console.log(req.body.email);
        const result = await user.findOne({ where: { email: req.body.email } });
        console.log(result);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("----->",SendinblueAPIKey)
        SendinblueApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SendinblueAPIKey;

        const subject = "Password Reset";
        const sender = { 'email': 'enterbhatt123@gmail.com', 'name': 'manoj' };
        const toEmail = [{ 'email': req.body.email }];
        const textContent = 'dummy email';
        console.log("toEmail",toEmail)
        new SendinblueApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
            'subject': subject,
            'sender': sender,
            'to': toEmail,
            'textContent': textContent

        }).then((data)=> {
            console.log(data);
            return res.status(200).json({ message: 'Password reset email sent successfully' });
        }).catch((error)=> {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred while sending the email' });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}
