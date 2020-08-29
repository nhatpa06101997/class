const express = require('express');
const router = express.Router();

const Major = require('../model/majors');

router.get('/',async(req,res,next)=>{
    try {
        const data = await Major.find();
        res.render('admin/majors',{
            majors: data
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/add',async(req,res,next) =>{
    try {
        res.render('admin/add_majors');
    } catch (error) {
        console.log(error);
    }
});

router.post('/add',async(req,res,next) =>{
    try {
        const title = req.body.title;
        const slug = title;

        req.checkBody('title',"Title must an value").notEmpty();

        const errors = await req.validationErrors();

        if(errors){
            res.render('admin/add_majors',{
                errors: errors
            })
        }else{
            const data = await Major.findOne({slug:slug});
            if(data){
                req.flash('danger',"Slug exists!!");
                res.render('admin/add_majors');
            }else{
                const major = new Major({
                    title: title,
                    slug: slug
                });
                await major.save();
            }
            req.flash('success',"Created major!!");
            res.redirect('/admin/majors')
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/edit/:id',async(req,res,next)=>{
    try {
        const data = await Major.findById(req.params.id);
        res.render('admin/edit_majors',{
            majors: data,
            id: data._id
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/edit/:id',async(req,res,next) =>{
    try {
        const title = req.body.title;
        const slug = title;
        const id = req.params.id;

        req.checkBody('title',"Title must an value").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/edit_majors',{
                errors: errors,
                id: id,
                title: title
            });
        }else{
            const data = await Major.findOne({slug:slug, _id:{'$ne':id}});
            if(data){
                req.flash('danger',"Title exists!!");
                res.render('admin/edit_majors',{
                    id:id,
                    title: ""
                });
            }else{
                const major = await Major.findById(id);
                major.title = title;
                major.slug = slug;

                await major.save();
            }
            req.flash('success',"Edited major!!");
            res.redirect('/admin/majors')
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/delete/:id',async(req,res,next)=>{
    try {
        await Major.findByIdAndRemove(req.params.id);
        req.flash('success',"Deleted major!!");
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;