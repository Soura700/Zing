const express = require("express");
var router = express();
const Comment = require("../models/Comment");
const connection = require("../connection");
const io = require("../socket");


// API for posting a comment
router.post('/create_comments', async (req, res) => {
    console.log("Called");
    try {
        const { postId, userId, userName , text } = req.body;
        console.log("Hello Text");
        console.log(postId + userId + text)


        const newComment = new Comment({
             postId:postId, 
             userId:userId, 
             userName:userName,
             text:text 
        });
       const comment = await newComment.save();

        // Update the comments array in the Post model
        // await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

        // Broadcast the new comment to everyone in the room (post id)
        // io.to(postId).emit('comment', newComment);
        io.emit('comment', {comment:newComment , postid: postId , userid:userId });
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API for deleting a comment
router.delete('/delete_comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        // Find the comment and its associated postId
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Remove the comment reference from the Post model
        // await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: commentId } });

        // Delete the comment from the Comment model
        await Comment.findByIdAndDelete(commentId);

        // Broadcast the deleted comment to everyone in the room (post id)
        // io.to(comment.postId).emit('deleteComment', commentId);

        io.emit('deleteComment', {comment:comment , commentId:comment._id});

        res.status(200).send({msg:"Done"}); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/get_comments/:postId" , async (req,res)=>{
    let postId=req.params.postId;
    try{
        let comments=await Comment.find({postId : postId}).sort("createdAt");
        res.status(200).json(comments);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;