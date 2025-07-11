const express = require('express');
const router = express.Router();
const { getMe } = require("../controllers/userControllers");
const verifyToken = require('../middlewares/verifyToken');

router.get('/me', verifyToken, getMe);

module.exports = router;