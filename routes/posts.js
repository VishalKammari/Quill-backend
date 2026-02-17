const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const post = require('../Models/Post');
const comment = require('../Models/Comment');
const bcrypt = require('bcrypt');
const verifyToken = require('../verifytoken');



router.get('/user/:userId',verifyToken, async (req, res) => {
  try {
    const posts = await post.find({userId: req.params.userId});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});



router.post("/create",verifyToken,async (req,res)=>{
    try{
        const newpost = new post(req.body);
        // console.log(req.body)
        const savedPost=await newpost.save()
        
        res.status(200).json(savedPost)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
     
})

//update
router.put('/:id',verifyToken, async (req, res) => {
  try {
    const updatedpost = await post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedpost);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});



//delete
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    await post.findByIdAndDelete(req.params.id);
    await comment.deleteMany({postId: req.params.id});
    res.status(200).json("Post deleted successfully");
    } catch (err) {
    res.status(500).json("Internal server error");
  }
});

//GET POST DETAILS
router.get('/:id', async (req, res) => {
  try {
    const foundPost = await post.findById(req.params.id);
    console.log(foundPost);
    res.status(200).json(foundPost);
  } catch (err) {
    res.status(500).json(err);
  }
});




//get all posts 
router.get('/', async (req, res) => {
  try {
    const searchFilter = {title: { $regex: req.query.search || '', $options: 'i' }};
    const post1 = await post.find(searchFilter);
    res.status(200).json(post1);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

//get post


//search posts by title


module.exports = router;
