const mysql = require("mysql")


const connection = mysql.createConnection({
    // host: "localhost",
    // user:"root",
    // password: "root123",
    // database:"socialmedia"

    host : "pgr.h.filess.io",
    user : "zing_withouttax",
    password : "ed055c82c681e804d823c4ec2f642b466cfbcdc3",
    database : "zing_withouttax",
    port:"3307",

    // host: "3p7.h.filess.io",
    // user: "Zing_wasseenme",
    // password: "aba4fbd7bf4c8e9979353d5817480b241dfd5806",
    // database: "Zing_wasseenme",
    // port: 3307,
  });


  module.exports=connection;