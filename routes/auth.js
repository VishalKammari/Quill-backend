const express=require('express');
const router=express.Router();
const user=require('../Models/user');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
router.post('/register',async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const hashpass = await bcrypt.hash(password, 10);
        const newuser=await user.create({
            username,
            email,
            password:hashpass});
        res.status(201).json(newuser);
    }
    catch(err){
        res.status(500).json(err.message);
    }
})
//login

// time:1:57
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user1 = await user.findOne({ email });
    if (!user1) {
      return res.status(401).json("User or password is incorrect");
    }

    const validpass = await bcrypt.compare(password, user1.password);
    if (!validpass) {
      return res.status(401).json("User or password is incorrect");
    }
    
    const token = jwt.sign(
      { id: user1._id,username: user1.username,email: user1.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    const { password: pwd, ...others } = user1._doc;

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,     
    sameSite: "None"
  })
  .status(200)
  .json(others);
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});


router.get('/logout',async(req,res)=>{
    try{
      res.clearCookie("token").status(200).json("User logged out successfully");
    }
    catch(err){
        res.status(500).json("Internal server error");
    }
});


//refech users
router.get('/refetch',async(req,res)=>{
    const token=req.cookies.token;
    jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
        if(err){
            return res.status(401).json("Unauthorized");
        }
        res.status(200).json(decoded);
    });
});


module.exports=router;

