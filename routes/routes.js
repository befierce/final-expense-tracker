const express = require('express');
const routeSignUP = require('../controllers/signup');
const routelogin = require('../controllers/login');
const expense = require('../controllers/expense')
const router = express.Router();


router.post('/user/signUp',routeSignUP.signUpToTheServerController);
router.post('/user/login',routelogin.loginToServerController);

//-----------------------------------------------------------

router.get('/user/expense',expense.getExpenseDataFromTheServer);
router.post('/user/expense',expense.postExpenseDataToTheServer);
router.get('/user/expense/:id',expense.getSingleExpenseDataFromTheServer);
router.delete('/user/expense/:id',expense.deleteSingleExpenseDataFromTheServer);



module.exports = router;