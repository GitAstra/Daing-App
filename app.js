const express = require('express');
const app = express();
const connectDB = require('./config/db');

const cors = require('cors');

// MiddleWares
app.use(cors());
app.use(express.json());
connectDB()

app.use('/api/auth', require('./routes/auth'));

app.listen(5000, ()=>{
    console.log('Server Up at http://localhost:5000');
})


app.get('/', async(req, res)=>{
   res.json('Welcome to Dating API')
})

