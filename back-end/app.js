const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();
const Routes = require('./routes/routes');
const { user, userExpense, Order, forgotPasswordRequests,Filedownloaded } = require('./models/user');



user.sync();
userExpense.sync();
Order.sync();
forgotPasswordRequests.sync();
Filedownloaded.sync();

app.use(cors());
app.use(express.json());

app.use('/',Routes);    

app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running at port 3000")
})