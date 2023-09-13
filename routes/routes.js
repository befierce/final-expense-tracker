const express = require('express');
const routeSignUP = require('../controllers/signup');
const routelogin = require('../controllers/login');
const expense = require('../controllers/expense');
const purchase = require('../controllers/purchase');
const leaderboard = require('../controllers/leaderboard.js');
const forgotPassword = require('../controllers/forgotPasswordControll');
const downloadController = require('../controllers/downloadController');
const router = express.Router();

router.post('/user/signUp',routeSignUP.signUpToTheServerController);
router.post('/user/login',routelogin.loginToServerController);
//-----------------------------------------------------------
router.get('/user/expense/:userId',expense.getExpenseDataFromTheServer);
router.post('/user/expense',expense.postExpenseDataToTheServer);
router.get('/user/expense/edit/:id',expense.getSingleExpenseDataFromTheServer);
router.delete('/user/expense/:id',expense.deleteSingleExpenseDataFromTheServer);

router.get('/user/purchase/premium',purchase.purchasePremium);
router.post('/user/purchase/premium',purchase.verifyPayment);

router.get('/user/premium/leaderboard',leaderboard.getUserExpenseDataForLeaderboard);
router.post('/user/password/forgotPassword',forgotPassword.forgotPasswordController);

router.post('/user/password/resetPassword/',forgotPassword.changePasswordController);
router.get('/user/password/resetPassword/:uuid',forgotPassword.resetPasswordController);


router.get('/download',downloadController.downloadExpenseController);
router.get('/user/get/download/data',downloadController.getPreviousData);



module.exports = router;