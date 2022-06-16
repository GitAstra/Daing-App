const jwt = require('jsonwebtoken');

const JWT_SECRET = "aalongaksljdf123129jasdf123123s";

const User = require('../models/User');



function verifyToken(req, res, next){
    const token = req.header('date-tkn');
    if(!token){
        res.status(400).json('Not Authenticated')
    }
    try{
        const data = jwt.verify(token, JWT_SECRET, (err, user)=>{
            if(!err){
                req.user = user
                next()
            }
        })
    }
    catch(err){
        res.status(400).json('Invalid Token')
    }
}

module.exports = verifyToken;