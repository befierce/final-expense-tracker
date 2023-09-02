const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

app.use('/user/login',(req,res,then)=>{
    console.log(req)
})


app.listen(3000,()=>{
    console.log("server is running at port 3000")
})