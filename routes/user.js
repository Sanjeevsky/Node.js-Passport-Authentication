const express=require('express');
const User= require('../model/User');
const bcrypt=require('bcrypt');
const passport=require('passport');

const router=express.Router();
router.get('/login',(req,res)=>{
    res.render('login'); //Rendering Middleware
});
//register page
router.get('/register',(req,res)=>{res.render('register')})
//Register Handle
router.post('/register',(req,res)=>{
    const {name,email,password,password2}=req.body;;
    let errors=[];

    //check required fields
    if(!name ||!email|| !password|| !password2){
        errors.push({msg:"Please Fill in All Fields"});

    }

    //Checking For Password Match
    if(password!==password2){
        errors.push({msg:"Paswword doesn't match"});
    }
    if(password.length<6){
        errors.push({msg:"Password Should Be Alleast 6 Characters"});

    }
    if(errors.length>0){
        res.render('register',{errors,email,name,password,password2});
    }
    else{
        //Validation Passed
        User.findOne({email:"email"}).then((user)=>{
            if(user!=''){
                //User Exists
                errors.push({msg:"Email Already Registered"});
                res.render('register',{errors,email,name,password,password2});
            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password,
                });

                //Hash Password
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err){
                        throw err;
                    }
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;

                        //set password to user
                        newUser.password=hash;
                        newUser.save().then(user=>{
                            req.flash('success_msg','You are now Registered and Can login');
                            res.redirect('/login');
                        }).catch(err=>{
                            console.log(err);
                            
                        });

                    });
                });

            };
        });
    };
});
//login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"LogOut Successful");
    res.redirect('/users/login');
});


module.exports=router;