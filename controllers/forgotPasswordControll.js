const SendinblueApiV3Sdk = require('sib-api-v3-sdk');
const SendinblueAPIKey = process.env.SENDINBLUE_API_KEY;
const { user, userExpense, Order, sequelize, forgotPasswordRequests } = require('../models/user')
const { v4: uuidv4 } = require("uuid");
const path = require('path');
const bcrypt = require('bcrypt');



exports.forgotPasswordController = async (req, res) => {
    try {
        // console.log(req.body.email);
        const result = await user.findOne({ where: { email: req.body.email } });
        console.log("result after search form database", result.dataValues.userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }
        // console.log("----->",SendinblueAPIKey)
        SendinblueApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SendinblueAPIKey;

        const subject = "Password Reset Email";
        const sender = { 'email': 'enterbhatt123@gmail.com', 'name': 'manoj' };
        const toEmail = [{ 'email': req.body.email }];
        const textContent = 'dummy email';
        // console.log("toEmail",toEmail)
        const uuid = uuidv4();
        const resultAfterSendingEmail = await new SendinblueApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
            'subject': subject,
            'sender': sender,
            'to': toEmail,
            'textContent': textContent,
            'htmlContent': `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
          
              <table style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
                  <tr>
                      <td style="text-align: center;">
                          <h1>Password Reset</h1>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <p>Hello,</p>
                          <p>We received a request to reset the password associated with this email address. If you didn't initiate this request, you can safely ignore this email.</p>
                          <p>To reset your password, please click the button below:</p>
                          <p style="text-align: center;">
                              <a href="http://localhost:3000/user/password/resetPassword/${uuid}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                          </p>
                          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                          <p>http://localhost:3000/user/password/resetPassword/${uuid}</p>
                         
                         
                          <p>Thank you,</p>
                          <p>The Start Expense Team</p>
                      </td>
                  </tr>
              </table>
          
          </body>
          </html>
          `
        })
        console.log(resultAfterSendingEmail);


        const resultCreateForgotPasswordTable = await forgotPasswordRequests.create({
            uuid: uuid,
            isActive: true,
            usersListUserId: result.dataValues.userId
        })
        console.log("result after table is created", resultCreateForgotPasswordTable);
        return res.status(200).json({ message: 'Password reset email sent successfully' });

        // console.error(error);
        // return res.status(500).json({ error: 'An error occurred while sending the email' });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
}


exports.resetPasswordController = async (req, res) => {

    try {
        //console.log(req.params);

        const isActive = await forgotPasswordRequests.findOne({ where: { uuid: req.params.uuid } });
        
        if (isActive) {
            // console.log('request reached here');
            return res.sendFile(path.join(__dirname, '../views/login/resetPassword.html'));
            
        }
        else{
            return res.status(404).json({ error: 'Invalid or expired reset link' });
        }
    } catch (error) {
        console.log(error);
    }
}

exports.changePasswordController = async (req,res)=>{
    try {
        console.log("req reached here 2",req.body)
        const {newPassword,uuid} = req.body;
        console.log("newPassword",newPassword);
       console.log("uuid",uuid);
        const result = await forgotPasswordRequests.findOne({where:{uuid:uuid,isActive:true}})
        console.log("result",result);
        const id = result.dataValues.usersListUserId;
        result.update({isActive:false});

        bcrypt.hash(newPassword, 10, async (err, hash) => {

             await user.update({password:hash},{where:{userId:id}})
             res.status(200).json({message:'your password is updated , now go to login page and login again',success:'ok'})
        
        })
        
    }catch(err){
        console.log(err)
        console.log('something went wrong')
        res.status(503).json('got error while updating')
    }
    
}








