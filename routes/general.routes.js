'use strict';

const express = require("express");
const axios = require("axios");
const movies = require("../Movie data/data.json");
const Router = express.Router();


Router.get('/', (req, res, next) => {
    try {
        let movie = new HomeMovie(
            movieData.title,
            movieData.poster_path,
            movieData.overview
        );
        res.status(200).json(movie);
    } catch (error) {
        next(`Home handler : ${error}`);
    }
});

module.exports = Router;