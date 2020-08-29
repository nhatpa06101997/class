const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../model/users');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        User.findOne({username:username},(err,data)=>{
            if(err) console.log(err);

            if(!data){
                return done(null,false,{message: "User not found!"});
            }else{
                bcrypt.compare(password,data.password,(err,isMatch)=>{
                    if(err)console.log (err);

                    if(isMatch){
                        return done(null,data);
                    }else{
                        return done(null,false,{message: "Wrong password!"});
                    }
                })
            }
        });
    }));
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    });

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,data)=>{
            done(err,data);
        });
    });
}