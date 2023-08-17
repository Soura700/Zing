const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var router = express();
const bcrypt = require("bcrypt");
const connection = require("../connection")

//delete post
router.delete("/delete_post/:userId/:postId", (req,res) => {
    const userId = req.params.userId;
    const postId = req.params.postId;
    try{
        connection.query(
            "DELETE FROM posts WHERE id = ? ",
            [postId],
            (error,results) =>{
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.status(200).json("Post has been deleted successfuly");
                }
            }
        )
    }
    catch(error){
        res.status(500).json(error);
    }
})
module.exports = router;