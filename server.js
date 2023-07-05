'use strict';

let express = require("express");
let cors = require("cors");
let data = require("./Movie data/data.json");
let app = express();
const axios = require("axios");
require('dotenv').config();
const generalRoutes = require("./routes/general.routes");
const moviesRoutes = require("./routes/moviesRoutes")
const client = require("./client");
const notFoundHnadler = require("./error_handlers/404");
const InternalErrorsHnadler = require("./error_handlers/500");
const { PORT } = require("./configs");

app.use(cors());
app.use(express.json());

// handle 404 errors
app.use(notFoundHnadler);
// handle 500 errors
app.use(InternalErrorsHnadler);

app.use(generalRoutes);
app.use("/movies",moviesRoutes);


client.connect().then(()=>{
  app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
  })
});
