require("dotenv").config()
module.exports = {
    PORT: process.env.PORT,
    DBURL: process.env.DATABASE_URL,
    APIKEY: process.env.SECRET_API,
}