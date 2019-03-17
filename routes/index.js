const express=require('express');
var Auth=require('../config/auth').authentication;

const router=express.Router();
//Welcome Page
router.get('/',(req,res)=>{
    res.render('welcome'); //Rendering Middleware
});

//DashBoard
router.get('/dashboard',Auth,(req,res)=>res.render('dashboard',{
    user:req.user
}));



module.exports=router;