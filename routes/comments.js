const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const post = require('../Models/Post');
const comment = require('../Models/Comment');
const bcrypt = require('bcrypt');
const verifyToken = require('../verifytoken');


router.post('/create',verifyToken,async(req,res)=>{
    try{
        const newcomment=new comment(req.body);
        const savedcomment = await newcomment.save();
        res.status(200).json(savedcomment);
    }
    catch(err){
        res.status(500).json("Internal server error");
    }
});

//update
router.put('/:id',verifyToken, async (req, res) => {
  try {
    const updatedcomment = await comment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedcomment);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});



//delete
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    await comment.findByIdAndDelete(req.params.id);
    res.status(200).json("Comment deleted successfully");
    } catch (err) {
    res.status(500).json("Internal server error");
  }
});





router.get('/posts/:postId',verifyToken, async (req, res) => {
  try {
    const comments = await comment.find({postId: req.params.postId}).sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

module.exports = router;