const express = require("express");
const router = new express.Router();
const authenticate=require('../middlewares/auth')
const {
    newUser,
    loginUser,
    logout,
    feedback
}=require('../controllers/user');
const { Router } = require("express");

router.post('/newUser',newUser)
router.post('/loginUser',loginUser)
router.get('/logout',logout)
router.post('/feedback',authenticate,feedback)

module.exports=router