const mysql = require("mysql")


const connection = mysql.createConnection({
    host: "localhost",
    user:"root",
    password: "root123",
    database:"socialmedia"
    // host: "sql6.freemysqlhosting.net",
    // user:"sql6684938",
    // password: "UpuBjKez3X",
    // database:"sql6684938"
    // host: "sql207.infinityfree.com",
    // user:"if0_36010304",
    // password: "cnJlNk5hkJkQfV",
    // database:"if0_36010304_socialmedia",
  });


  module.exports=connection;