const express = require("express");
const {json} = require("express");
const app = express();
require('dotenv').config();


const cors = require("cors");

app.use(json());
app.use(cors());
app.get('/', async (req,res) =>{
    res.send("Ola");
})

const summoner = require('./routes/summoner');
const match = require('./routes/match');
app.use('/', summoner);
app.use('/', match);


//STARTING SERVER
const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server is runnin on http://localhost:${PORT}`)
});