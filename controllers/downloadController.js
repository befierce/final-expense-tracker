const jwt  = require('jsonwebtoken');
const secretKey = '15s253d34dwe4ffsf3df4srr';


exports.downloadExpenseController = (req, res) => {
    console.log(req.headers);
    jwt.verify(req.headers.authorisation,secretKey,(err,decoded)=>{
        if(err){
            return res.status(400).json({error: 'token is invalid'});
        }
        else{
            console.log("token after decoding",decoded);
        }
    })
}