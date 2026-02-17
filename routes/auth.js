const express = require('express');
const router = express.Router();
const user = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const isProd = process.env.NODE_ENV === "production";

/* REGISTER */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashpass = await bcrypt.hash(password, 10);

    const newuser = await user.create({
      username,
      email,
      password: hashpass
    });

    res.status(201).json(newuser);

  } catch (err) {
    res.status(500).json(err.message);
  }
});


/* LOGIN */
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
      { id: user1._id, username: user1.username, email: user1.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    const { password: pwd, ...others } = user1.toObject();

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json(others);

  } catch (err) {
    res.status(500).json("Internal server error");
  }
});


/* LOGOUT */
router.get('/logout', async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax"
    });

    res.status(200).json("User logged out successfully");

  } catch (err) {
    res.status(500).json("Internal server error");
  }
});


/* REFETCH USER */
router.get('/refetch', async (req, res) => {
  try {

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json("Unauthorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json(decoded);

  } catch (err) {
    return res.status(401).json("Unauthorized");
  }
});

module.exports = router;
