var express=require('express');

var passport=require('passport');

var router=express.Router()

router.get('/login',(req,res) => res.render('login'));

router.get('/register',(req,res) => res.render('register'));

const User=require('../models/User');

const bcrypt=require('bcryptjs');

router.post('/register',function(req,res){
    console.log(req.body);
    const {nameofuser,username,password,conf_password,email}=req.body;
    let errors=[]
    if (!nameofuser || !username || !password || !email){
        errors.push("Fields can not be left empty");
    }
    if (password.length<6){
        errors.push('Password length must be greater than 6');
    }
    if(password != conf_password){
        errors.push('Password do not matches');
    }
    if (errors.length>0){
        res.render('register',{
            errors,
            nameofuser,
            username,
            password,
            conf_password,
            email
        })
    }
    else{
        User.findOne({email:email})
        .then(user => {
            if(user){
                errors.push('Email is already registered');
                res.render('register',{
                    errors,
                    nameofuser,
                    username,
                    password,
                    conf_password,
                    email
                }); 
            }
            else{
                const newUser=new User({
                    nameofuser,
                    username,
                    password,
                    email
                });
                bcrypt.genSalt(10,(err,salt) => {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err) throw err;

                        newUser.password=hash;
                        //console.log(newUser.password);
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You have successfully created your account. Login to Continue');
                            res.redirect('/user/login');
                        })
                        .catch(err => console.log(err));
                    })
                })
            }
        });
    }
});

router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','Successfully Logged Out!');
    res.redirect('/');
})

module.exports=router;