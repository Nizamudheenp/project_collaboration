const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(express.json());
app.use(cors());
const authRoutes = require('./routes/authRoutes');



const connectDB = require('./config/db');
connectDB();
app.use('/api/auth', authRoutes);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`app listening at port ${port}`);
});