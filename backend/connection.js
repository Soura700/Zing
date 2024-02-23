const mysql = require("mysql");

const connection = mysql.createConnection({
  // host: "localhost",
  // user:"root",
  // password: "root123",
  // database:"socialmedia"

  // host : "pgr.h.filess.io",
  // user : "zing_withouttax",
  // password : "ed055c82c681e804d823c4ec2f642b466cfbcdc3",
  // database : "zing_withouttax",
  // port:"3307",

  // host: "3p7.h.filess.io",
  // user: "Zing_wasseenme",
  // password: "aba4fbd7bf4c8e9979353d5817480b241dfd5806",
  // database: "Zing_wasseenme",
  // port: "3307",

  user: "avnadmin",
  password: "AVNS_btM1p0D9KHnIG7blQFq",
  host: "mysql-2c37a9e7-samadritcse-c448.a.aivencloud.com",
  database: "defaultdb",
  port: "23390",
});

module.exports = connection;
