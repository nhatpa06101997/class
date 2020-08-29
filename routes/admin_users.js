const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../model/users');
const Sub = require('../model/subjects');

router.get('/',async(req,res,next) =>{
    try {
        const data = await User.find();
        res.render('admin/users',{
            users:data
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id',async(req,res,next) =>{
    try {
        const id = req.params.id;
        const s = await Sub.find();
        const u = await User.findById(id);
        res.render('admin/edit_users',{
            user: u,
            subject: u.subject,
            subs: s,
            id: u._id
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/edit/:id',async(req,res,next)=>{
    const s = await Sub.find();
    const u = await User.findById(req.params.id);
    try {
        const id = req.params.id;
        const sub = req.body.sub;
        const password = req.body.password;
        const status = req.body.status;
        const sex = req.body.sex;

        req.checkBody('password',"Password must an value!").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/edit_users',{
                errors: errors,
                id: id,
                subject: u.subject,
                user: u,
                subs: s
            });
        }else{
            const data = await User.findOne({username: u.username, _id:{'$ne':id}});
            if(data){
                req.flash('danger',"username exists");
                res.redirect('admin/edit_users',{
                    id: id,
                    subject: u.subject,
                    user: u,
                    subs: s
                })
            }else{
                const user = await User.findById(id);
                    user.subject = sub;
                    user.status = status;
                    user.sex = sex;
                if(user.password == password){
                    user.password = password;
                }else{
                    const hash = await bcrypt.hash(password,10);
                    user.password = hash;
                }
                console.log( user.password + '/' + password)
                await user.save();
            }
            req.flash('success',"Edited success!!");
            res.redirect('/admin/users')
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/delete/:id',async(req,res,next) =>{
    try {
        await User.findByIdAndRemove(req.params.id);
        req.flash('success',"Deleted success!!");
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;