"use strict"; 

let express = require("express");
let cors = require("cors");
let data = require("./Movie data/data.json");
let app = express();
const axios = require("axios");
require('dotenv').config();

app.use(cors());
app.use(express.json());



app.get('/', handleHome);
app.get('/favorite', handleFav);

// handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({
    code: 404,
    message: "Not Found",
    extra: "you can visit only home",
  });
 
});

// handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send({
    code: 500,
    message: "Server Error",
  });
});
  

function handleHome(req, res) {
    let movie = new HomeMovie(
      movieData.title,
      movieData.poster_path,
      movieData.overview
  );
  res.json(movie);
}



function handleFav(req, res) {
    console.log('testing the favorite url');
    res.send('welcome to favorites');
}

app.get("/trending",async (req,res)=>{
  
  let axiosTrendRespons= await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECRET_API}&language=en-US`);
  let dataTrindingArr=axiosTrendRespons.data['results'];
  let trindingArr=[];
  for (let i =0;i<dataTrindingArr.length; i++){
    trindingArr.push(dataTrindingArr[i].id,
      dataTrindingArr[i].title,
      dataTrindingArr[i].release_date,
      dataTrindingArr[i].poster_path,
      dataTrindingArr[i].overview);   
  }
  res.send(trindingArr);
});

app.get("/search", async(req,res)=>{
  
  let userData = req.query.name;
  let axiosSearchRespons = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECRET_API}&language=en-US&query=${userData}&page=2`);
  let dataSearchArr = axiosSearchRespons.data['results'];
  let searchArr = [];
  for(let i = 0; i<dataSearchArr.length;i++){
    searchArr.push(dataSearchArr[i].id,
      dataSearchArr[i].title,
      dataSearchArr[i].release_date,
      dataSearchArr[i],poster_path,
      dataSearchArr[i].overview);
  }
  res.send(searchArr);
});

app.get("/list",async (req,res)=>{
  let axiosGenreList=await axios.get(`https://api.themoviedb.org/3/genre/movie/listapi_key=${process.env.SECRET_API}`);
  let dataListArr = axiosGenreList.data['results'];
  let listArr=[];
  for (let i=0; i<dataListArr; i++){
    listArr.push(dataListArr[i].genre_ids);
  }
  res.send();
});



app.listen(3000, startingLog);

function startingLog(req, res) {
  console.log("Running at 3000");
}
