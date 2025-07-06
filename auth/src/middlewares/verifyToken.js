const jwt = require('jsonwebtoken');
const verifyToken =(req, res,next) =>{
    const header = req.headers["authorization"];
    if(!header) return res.status(401).json({
        message:"Auth token missing"
    });

const token =header.split(" ")[1];
try{
    const data =jwt.verify(token,process.env.JWT_SECRET);
    req.user=data;
    next();
}

catch(err){
    return res.status(403).json({
        message:"Invalid or expired token"
    });
}


};

module.exports =verifyToken;