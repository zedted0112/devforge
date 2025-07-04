const express = require('express');
const router = express.Router();
const {signupUser,loginUser}= require('../controllers/authControllers');
// temporary test routes
router.get('/ping',(req, res)=>{
    res.send('Auth service is live');
});


//user sign up routes
router.post('/signup', signupUser);

// user login route

router.post('/login', loginUser);

module.exports= router;