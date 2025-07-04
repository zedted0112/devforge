const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//routes placeholders

app.use('/api/auth',require('./routes/authRoutes'));
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
    console.log(`Auth service running on port ${PORT}`);
});
