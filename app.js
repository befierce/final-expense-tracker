const express = require('express');
const cors = require('cors');
const app = express();
const Routes = require('./routes/routes');
const { user, userExpense } = require('./models/user')



user.sync();
userExpense.sync();
app.use(cors());
app.use(express.json());

app.use(Routes);


app.listen(3000,()=>{
    console.log("server is running at port 3000")
})