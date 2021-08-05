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




app.listen(process.env.PORT,()=>{
    console.log(`Server is runnin on http://localhost:${process.env.PORT}`)
});