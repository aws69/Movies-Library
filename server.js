"use strict"; 

let express = require("express");
let cors = require("cors");
let data = require("./Movie data/data.json");
let app = express();


app.use(cors());
app.use(express.json());



app.get('/', handleHome);
app.get('/favorite', handleFav);
app.get('/*', handleNotFoud);

// handle 404 errors
function handleNotFoud(req, res) {
    res.send({
      code: 404,
      message: "Not Found",
      extra: "you can visit only home and favorites routes ",
    });
  }

// handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send({
    code: 500,
    message: "Server Error",
    ahamd: err,
  });
});
  

function handleHome(req, res) {
    res.send({
        title: data.title,
        poster_path: data.poster_path,
        overview: data.overview
    });
}



function handleFav(req, res) {
    console.log('testing the favorite url');
    res.send('welcome to favorites');
}


app.listen(3000, startingLog);

function startingLog(req, res) {
  console.log("Running at 3000");
}
