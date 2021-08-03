const express = require("express");
const {json} = require("express");
const app = express();
require('dotenv').config();

const axios = require("axios");
const cors = require("cors");

app.use(json());
app.use(cors());
app.get('/', async (req,res) =>{
    res.send("Ola");
})

app.get('/summoner/:username', async (req,res) => {
    const {username} = req.params;

    const getSummonerId = await axios.get(
        `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`,
        {headers : 
              {
                "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
            
        }}
    ).catch( err => {
        res.send(err);
    })

    const { id, profileIconId, summonerLevel} = getSummonerId.data;

    const getSummonerMasterys = await axios.get(
        `https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}`,
        {headers : 
            {
                "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
          
      }}
    ).catch( err => {
        res.send(err);
    })

    const getAllChampions = await axios.get(
        `http://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/champion.json`
    ).catch( err => {
        res.send(err);
    })
    

    const ordenateSummonerMasterys = () => {
        return getSummonerMasterys.data.sort((a, b) => a[0] - b[0])
    }

    const getTopMasterys= () => {
        let championsList = [];
        for (let index = 0; index < 3; index++) {
            championsList.push(ordenateSummonerMasterys()[index].championId);
            
        }

        return championsList;
    }

    const getChampionsInfo = () => {
        let listOfThings = [];
        for (let index = 0; index < getTopMasterys().length; index++) {
            for (var key of Object.keys(getAllChampions.data.data)) {
                if(getTopMasterys()[index] == getAllChampions.data.data[key].key){
                    listOfThings.push(getAllChampions.data.data[key].id)
                }
            }
            
        }
        return listOfThings;
    }

    const agoravai = () => {
        let listOfThings = [];
        for (var key of Object.keys(getAllChampions.data.data)) {
            listOfThings.push(getAllChampions.data.data[key].id)
        }

        return listOfThings;
    }
    const responseRanked = await axios.get(
        `https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
        {headers : 
            {
                "X-Riot-Token": `${process.env.LEAGUE_API_KEY}`
          
      }}
    ).catch( err => {
        res.send(err);
    })
    
    const {tier, rank, wins, losses, queueType} = responseRanked.data[1].queueType == 'RANKED_SOLO_5x5' ? responseRanked.data[1] : responseRanked.data[0];
   
    
    return res.json(
        
    {
        summonerLevel,
        tier,
        rank,
        wins,
        losses,
        queueType,
        iconUrl : `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/profileicon/${profileIconId}.png`,
        winRate :((wins / (wins + losses)) * 100).toFixed(1),
        
        champion1:`http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/${getChampionsInfo()[0]}.png`,
        champion1Name : getChampionsInfo()[0].toLowerCase(),
        champion2:`http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/${getChampionsInfo()[1]}.png`,
        champion2Name : getChampionsInfo()[1].toLowerCase(),
        champion3: `http://ddragon.leagueoflegends.com/cdn/11.15.1/img/champion/${getChampionsInfo()[2]}.png`,
        champion3Name : getChampionsInfo()[2].toLowerCase(),
        
    }
    )
    
    
    
})





//STARTING SERVER
const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`Server is runnin on http://localhost:${PORT}`)
});