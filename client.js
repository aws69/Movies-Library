const pg = require('pg');
const {DBURL} =require('./config'); 

const client = new pg.Client(DBURL);

module.exports = client;