const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const post = require('../Models/Post');
const comment = require('../Models/Comment');
const bcrypt = require('bcrypt');
const verifyToken = require('../verifytoken');

router.put('/:id',verifyToken, async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updateduser = await user.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updateduser);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});



//delete
router.delete('/:id',verifyToken, async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);
    await post.deleteMany({ userId: req.params.id });
    await comment.deleteMany({ userId: req.params.id });
    res.status(200).json("User deleted successfully");
    } catch (err) {
    res.status(500).json("Internal server error");
  }
});




//get user
router.get('/:id',verifyToken, async (req, res) => {
  try {
    const user1 = await user.findById(req.params.id);
    const { password, ...others } = user1._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});


module.exports = router;
