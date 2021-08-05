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
        
        res.send(err);
    })
    

    const getSummoner = () => {
       for (const key of Object.keys(getMatch.data.participants)) {
           if (getMatch.data.participants[key].championId == championId) {
               return getMatch.data.participants[key];
           }
       } 
    }

    const getSpells = await axios.get(
        `http://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/summoner.json`,
        {headers : 
            {
              "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
          
      }}
    ).catch( err => {
        
        res.send(err);
    })
    



    const {kills,deaths,assists,win} = getSummoner().stats
    const {spell1Id, spell2Id} = getSummoner();
    
    const getSpellName = () => {
        let list = [];
        for (const key of Object.keys(getSpells.data.data)) {
            if(getSpells.data.data[key].key == spell1Id || getSpells.data.data[key].key == spell2Id){
                list.push(getSpells.data.data[key].id);
            }
        }

        return list;
    }


    return res.json(
        
            {
                kills,
                deaths,
                assists,
                win,
                spell1Url : `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/spell/${getSpellName()[0]}.png`,
                spell2Url : `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/spell/${getSpellName()[1]}.png`,
                champion :`http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/${championName}.png`
            }
 
    )
});




module.exports = router;