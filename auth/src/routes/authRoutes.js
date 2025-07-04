const express = require('express');
const router = express.Router();
const {signupUser}= require('../controllers/authControllers');

// temporary test routes
router.get('/ping',(req, res)=>{
    res.send('Auth service is live');
});

router.post('/signup', signupUser);

module.exports= router;