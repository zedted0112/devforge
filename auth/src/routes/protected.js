const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/secret", verifyToken,(req,res)=>{
    res.json({
message:"you have accessed the protected zone",
user :req.user,
    });
});

module.exports = router;