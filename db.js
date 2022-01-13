const pg_pool = require('pg').Pool;

require('dotenv').config();

const pool = new pg_pool({
   user:process.env.USER,
   database:process.env.DATABASE,
   password:process.env.PASSWORD,
   host:process.env.HOST,
   port:process.env.PORT
});

module.exports=pool;