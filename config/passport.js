const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = ()=>{

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })

    passport.use('local',new LocalStrategy({
        usernameField: 'name',
        passwordField: 'pass',
        passReqToCallback: true
    },function (req,name,pass,done){
        const un = {'name':name}; //User find qilish uchun

        User.findOne(un,(err,user)=>{
            if(err){
                // throw err
                return done(err)
            }  
            if(!user)
                done(null,false,{message:'Bunday foydalanuvchi topilmadi'});
            if(user){
                bcrypt.compare(pass,user.password).then((result) =>{
                    if(!result){
                        done(null,false,{message:'Parol notog`ri'});
                    }
                    else{
                        const token = jwt.sign({user:user.name},process.env.JWT_SECRET_KEY,{
                            expiresIn:720
                        });
                        global.token = token;
                        done(null,user);
                    }
                })
            }
               

        })
    }))

}