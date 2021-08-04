const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require("axios");



router.get('/champion/:summonerId/:championName/:championId', async (req,res) => {
    const {championId,championName, summonerId} = req.params;

    const getLastMatch  = await axios.get(
        `https://br1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerId}?champion=${championId}`,
        {headers : 
            {
              "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
          
      }}
    ).catch( err => {
        res.send(err);
    })

    const getMatch = await axios.get(
        `https://br1.api.riotgames.com/lol/match/v4/matches/${getLastMatch.data.matches[0].gameId}`,
        {headers : 
            {
              "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
          
      }}
    ).catch( err => {
        console.log(getLastMatch.data);
        res.send(err);
    })
    

    const getSummoner = () => {
       for (const key of Object.keys(getMatch.data.participants)) {
           if (getMatch.data.participants[key].championId == championId) {
               return getMatch.data.participants[key];
           }
       } 
    }

    const {kills,deaths,assists} = getSummoner().stats
    
    return res.json(
        {
            championName,
            kills,
            deaths,
            assists
        }
    )
});




module.exports = router;