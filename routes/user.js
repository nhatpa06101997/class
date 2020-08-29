const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../model/users');
const Sub = require('../model/subjects');
const urlencode = require('urlencode');

router.get('/register',async(req,res,next) =>{
    try {
        const data = await Sub.find();
        res.render('home/register',{
            title: "Register",
            subs: data
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/register',async(req,res,next) =>{
    const s = await Sub.find();
    try {
        const name = req.body.name;
        const email = req.body.email;
        const sex = req.body.sex;
        const sub = req.body.sub;
        const username = req.body.username;
        const password = req.body.password;
        const password2= req.body.password2;

        req.checkBody('name',"Name must an value!!").notEmpty();
        req.checkBody('email',"Email must an value!!").isEmail();
        req.checkBody('username',"Username must an value!!").notEmpty();
        req.checkBody('password',"Password must an value!!").notEmpty();
        req.checkBody('password2',"Confirm password is incorrect ").equals(password);

        const errors = await req.validationErrors();
        if(errors){
            res.render('home/register',{
                errors: errors,
                subs: s,
                user: null,
                title: "Register"
            })
        }else{
            const data = await User.findOne({username: username});
            if(data){
                req.flash('danger',"Username exists!!");
                res.render('home/register',{
                    subs: s,
                    user:null,
                    title: "Register"
                })
            }else{
                const user = new User({
                    name: name,
                    email: email,
                    sex: sex,
                    subject : sub,
                    username: username,
                    password: password,
                    time: new Date(),
                    status:0,
                    admin: 0
                });
                if(user.name && user.username == "admin"){
                    user.admin = 1;
                    user.status = null;
                }else{
                    user.admin = 0;
                }
                const hash = await bcrypt.hash(password,10);
                user.password = hash;
                await user.save();
                console.log(Date.now())
            }
            
            req.flash('success',"Created user!!");
            res.redirect('/');
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/login',async(req,res,next) =>{
    try {
        if(res.locals.user) res.redirect('/');
        res.render('home/login',{
            title: "Login"
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/login',async(req,res,next) =>{
    try {
        await passport.authenticate('local',{
            successRedirect: "/",
            failureRedirect: "/users/login",
            failureFlash: true
        })(req,res,next);
    } catch (error) {
        console.log(error)
    }
});

router.get('/change/:id',async(req,res,next) =>{
    try {
        const data = await User.findById(req.params.id);
        res.render('home/change',{
            id: data._id,
            title: "Change Password"
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/change/:id',async(req,res,next) =>{
    try {
        const password = req.body.password;
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        const id =req.params.id;

        req.checkBody('password',"Password must an value!").notEmpty();
        req.checkBody('password1',"Password new must an value!").notEmpty();
        req.checkBody('password2',"Confirm password is incorrect!").equals(password1);

        const errors = await req.validationErrors();
        if(errors){
            res.render('home/change',{
                errors: errors,
                id: id,
                user:req.user,
                title: "Change Password"
            })
        }else{
            const data = await User.findById(id);
            if(!data){
                req.flash('danger',"User not found!!");
                res.render('home/change',{
                    id:id,
                    user:req.user,
                    title: "Change Password"
                })
            }else{
                const pass = await bcrypt.compare(password,data.password);
                if(!pass){
                    req.flash('danger',"Password Wrong!");
                    res.render('home/change',{
                        id:id,
                        user:req.user,
                        title: "Change Password"
                    })
                }else{
                    const hash = await bcrypt.hash(password1,10);
                    data.password = hash;
                    await data.save();
                }
                req.flash('success',"Change password success!!");
                res.redirect('/')
            }
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/select',async(req,res,next) =>{
    try {
        res.render('home/select',{
            title: "Password retrieval"
        })

    } catch (error) {
        console.log(error)
    }
});

router.post('/select',async(req,res,next) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const password2 = req.body.password2;
        req.checkBody('password2',"Confirm password wrong!").equals(password);
        
        const errors = await req.validationErrors();
        if(errors){
            res.render('home/select',{
                errors:errors,
                title:"Password retrieval",
                user:null
            })
        }else{
            const data = await User.findOne({email:email});
            if(!data){
                req.flash('danger',"Email exsts!!");
                res.render('home/select',{
                    title: "Password retrieval",
                    user: null
                })
            }else{
                const hash =await bcrypt.hash(password,10);
                data.password = hash;
                await data.save();

                req.flash('success',"Password sent via email!!");
                res.redirect('/')
                
            }
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/logout',async(req,res,next) =>{
    try {
        req.logout();
        req.flash('success',"Log out success");
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;