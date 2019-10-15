var LocalStrategy=require('passport-local').Strategy;

var mongoose=require('mongoose');

var bcrypt=require('bcryptjs');

const User=require('../models/User');

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'username'},(username,password,done) => {
            User.findOne({username:username})
            .then(user => {
                if(!user){
                    return done(null,false,{message: 'Account is not registered yet!'});
                }
                else{
                    bcrypt.compare(password,user.password,(err,isMatch) => {
                        if(err) throw err;

                        if(isMatch){
                            return done(null,user);
                        }
                        else{
                            return done(null,user,{message:'Password Incorrect!'});
                        }
                    });
                }
            })
            .catch(err => console.log(err));
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}