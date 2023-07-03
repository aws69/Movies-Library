'use strict';

let express = require("express");
let cors = require("cors");
let data = require("./Movie data/data.json");
let app = express();
const axios = require("axios");
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DBURL);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.post('/addMovie',)

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
  res.status(200).json(movie);
};



function handleFav(req, res) {
  console.log('testing the favorite url');
  res.status(200).send('welcome to favorites');
};


app.get("/trending", async (req, res) => {

  let axiosTrendRespons = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECRET_API}&language=en-US`);
  let dataTrindingArr = axiosTrendRespons.data['results'];
  let trindingArr = [];
  for (let i = 0; i < dataTrindingArr.length; i++) {
    trindingArr.push(dataTrindingArr[i].id,
      dataTrindingArr[i].title,
      dataTrindingArr[i].release_date,
      dataTrindingArr[i].poster_path,
      dataTrindingArr[i].overview);
  }
  res.status(200).send(trindingArr);
});


app.get("/search", async (req, res) => {

  let userData = req.query.name;
  let axiosSearchRespons = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECRET_API}&language=en-US&query=${userData}&page=2`);
  let dataSearchArr = axiosSearchRespons.data['results'];
  let searchArr = [];
  for (let i = 0; i < dataSearchArr.length; i++) {
    searchArr.push(dataSearchArr[i].id,
      dataSearchArr[i].title,
      dataSearchArr[i].release_date,
      dataSearchArr[i], poster_path,
      dataSearchArr[i].overview);
  }
  res.status(200).send(searchArr);
});


app.get("/list", async (req, res) => {
  let axiosGenreList = await axios.get(`https://api.themoviedb.org/3/genre/movie/listapi_key=${process.env.SECRET_API}`);
  let dataListArr = axiosGenreList.data['results'];
  let listArr = [];
  for (let i = 0; i < dataListArr; i++) {
    listArr.push(dataListArr[i].genre_ids);
  }
  res.status(200).send();
});


app.get('/getMovies', (req, res) => {
  const sql = `select * from added_movie`;
  client.query(sql).then(movies => {
    res.status(200).send(movies.rows);
  });
});


app.post('/addMovie', (req, res,) => {
  const userInput = req.body;
  const sql = `insert into added_movie(id, title, overview) values($1, $2, $3) returning *`;

  const handleValueFromUser = [userInput.id, userInput.title, userInput.overview];

  client.query(sql, handleValueFromUser).then(data => {
    res.status(201).send(data.rows)
  });
});


app.put('/UPDATE/:id', (req, res) => {
  const id = req.params.id;
  let dataToUpdate = req.body;
  const sql = `update movies_list set user_comment = $1  where id = $2 returning *`;
  const toUpdate = [dataToUpdate.user_comment, id];
  client.query(sql, toUpdate).then(updated => {
    res.status(202).json(updated.rows)
  });
});


app.delete('/DELETE/:id', (req, res) => {
  const toDeleteID = req.params.id;
  const sql = `delete from movies_list where id = ${toDeleteID}`;
  client.query(sql).then(() => {
    res.status(203).json({
      status: 203,
      message: 'The selected movie has been deleted successfully!'
    })
  }).catch(err => errorHandling(err, req, res));

});

app.get('/getMovie/:id',(req, res)=> {
  let id = req.params.id;
  const sql = `select * from movies_list where id = ${id}`;
  client.query(sql).then(gotById => {

    let obj = gotById.rows[0];
    console.log(obj)
    if (obj !== undefined) {
      let constructed = new Movie(obj.name, obj.title, obj.poster_path, obj.overview, obj.release_date, obj.first_air_date, obj.movie_id)
      res.status(204).json({
        Messeage: 'Movie Found!',
        result: constructed
      })
    }
    else {
      res.status(404).json({
        Messeage: 'Movie NoT Found!'

      })
    }

  })
});

  app.listen(PORT, () => {
    console.log(`listining at ${PORT}`);
  });

