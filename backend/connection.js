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

    // host : "rfr.h.filess.io",
    // user : "zing_orangeflat",
    // password : "4afef4ce42e72c54cabfbc741fe20cec36b4b24b",
    // database : "zing_orangeflat",
    // port:"3307",
  });


  module.exports=connection;