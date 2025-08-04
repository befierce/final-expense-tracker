const express = require("express");
const routeSignUP = require("../controllers/signup");
const routelogin = require("../controllers/login");
const expense = require("../controllers/expense");
const purchase = require("../controllers/purchase");
const leaderboard = require("../controllers/leaderboard.js");
const forgotPassword = require("../controllers/forgotPasswordControll");
const downloadController = require("../controllers/downloadController");
const router = express.Router();

router.post("/user/signUp", routeSignUP.signUpToTheServerController);
router.post("/user/login", routelogin.loginToServerController);
//-----------------------------------------------------------
router.get("/user/expense", expense.getExpenseDataFromTheServer);
router.post("/user/expense", expense.postExpenseDataToTheServer);
router.put("/user/expense/edit/:id", expense.updateSingleExpenseDataInTheServer);
router.delete(
  "/user/expense/:id",
  expense.deleteSingleExpenseDataFromTheServer
);

router.post("/user/purchase/premium", purchase.purchasePremium);
router.post("/user/verify/premium", purchase.verifyPayment);

router.get(
  "/user/premium/leaderboard",
  leaderboard.getUserExpenseDataForLeaderboard
);
router.post(
  "/user/password/forgotPassword",
  forgotPassword.forgotPasswordController
);

router.post(
  "/user/password/resetPassword/:uuid",
  forgotPassword.changePasswordController
);

router.get("/user/download", downloadController.downloadExpenseController);




module.exports = router;
