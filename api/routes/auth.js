const router = require("express").Router();
const User = require("../models/User");
const Conversation = require('../models/Conversation')
const bcrypt = require("bcrypt");
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

//GOOGLE LOGIN
const client = new OAuth2Client('665674215864-n0m8keq2ee6kolgseq8uvdogrpm85gm0.apps.googleusercontent.com');

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();
    console.log(ticket.getPayload())

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sub, salt);

    const user = await User.findOne({ email: email });
    if(!user) {
      // create new user
      const newUser = new User({
        username: name,
        email: email,
        profilePicture: picture,
        password: hashedPassword,
      });
      const user = await newUser.save();
      
      res.status(200).json({new:true, user})
    } else {
      res.status(200).json({new:false, user})
    }
    
  } catch (err) {
    res.status(500).json(err)
  }
});
module.exports = router;
