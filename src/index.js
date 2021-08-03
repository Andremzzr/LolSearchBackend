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
app.use('/', summoner);







//STARTING SERVER
const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server is runnin on http://localhost:${PORT}`)
});