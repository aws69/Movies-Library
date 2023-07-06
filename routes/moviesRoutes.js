'use strict';

const express = require('express');
const axios = require("axios");
const client = require('../client');
const { APIKEY } = require('../config');
const router = express.Router();

router.get('/favorite', (req, res, next) => {
    try {
        console.log('testing the favorite url');
        res.status(200).send('welcome to favorites');
    } catch (error) {
        next(`faviroute handler : ${error}`);
    }
});

router.get("/trending", async (req, res) => {
    try {
        let axiosTrendRespons = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}&language=en-US`);
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
    } catch (error) {
        next(`trending handler : ${error}`);
    }
});

router.get("/search", async (req, res, next) => {

    try {
        let userData = req.query.title;
        let axiosSearchRespons = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${userData}&page=2`);
        let dataSearchArr = axiosSearchRespons.data['results'];
        let searchArr = [];
        if (userData in dataSearchArr) {
            for (let i = 0; i < dataSearchArr.length; i++) {
                searchArr.push(dataSearchArr[i].id,
                    dataSearchArr[i].title,
                    dataSearchArr[i].release_date,
                    dataSearchArr[i], poster_path,
                    dataSearchArr[i].overview);
            }
            res.status(200).send(searchArr);
        } else {
            res.status(200).send(`No such Movie like ${userData.title}`);
        }
    } catch (error) {
        next(`search handler : ${error}`)
    }
});

router.get("/list", async (req, res, next) => {
    try {
        let axiosGenreList = await axios.get(`https://api.themoviedb.org/3/genre/movie/listapi_key=${APIKEY}`);
        let dataListArr = axiosGenreList.data['results'];
        let listArr = [];
        for (let i = 0; i < dataListArr; i++) {
            listArr.push(dataListArr[i].genre_ids);
        }
        res.status(200).send();
    } catch {
        next(`list handler : ${error}`);
    }
});

router.get('/getMovies', async (req, res, next) => {
    try {
        console.log(req.method, req.url);
        const sql = `select * from added_movie`;
        let respons = await client.query(sql);
        res.status(200).send(respons.rows);

    } catch {
        next(`getMovies handler : ${error}`);
    }
});

app.get('/getMovie/:id', (req, res, next) => {
    try {
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
                });
            }
            else {
                res.status(404).json({
                    Messeage: 'Movie NoT Found!'

                });
            }

        });
    } catch (err) {
        next(`gitonemovie handler : ${err}`);
    }
});


router.post('/addMovie', (req, res, next) => {
    try {
        const userInput = req.body;
        const sql = `insert into added_movie(id, title, overview) values($1, $2, $3) returning *`;

        const handleValueFromUser = [userInput.id, userInput.title, userInput.overview];

        client.query(sql, handleValueFromUser).then(data => {
            res.status(201).send(`Movie ${userInput.title} added successfully`);
        });
    } catch (error) {
        next(`addmovies handler : ${error}`);
    }
});

router.put('/UPDATE/:id', async (req, res, next) => {
    try {
        let { nweUser_comment } = req.body;
        const sql = `SELECT * FROM movies WHERE id=${req.params.id}`;
        client.query(sql).then((movieData) => {
            const { user_comment, id } = movies.rows[0];
            let sqlTow = `update movies_list set user_comment = $1  where id = ${req.params.id}`;

            client.query(sqlTow, [`${nweUser_comment}`]).then((data) => {
                res.status(200).send(`Comment Updated`);
            })
        })
    } catch (error) {
        next("update" + error);
    }
});

app.delete('/DELETE/:id', async (req, res,next) => {
    try {
        const toDeleteID = req.params.id;
        const sql = `delete from movies_list where id = ${toDeleteID}`;
        let data =await client.query(sql);
        res.status(204).end();
    } catch {
        next("delete" + error);
    }
});



module.exports = router;         