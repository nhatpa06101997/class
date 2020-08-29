const express = require('express');
const router = express.Router();

const Sub = require('../model/subjects');
const Major = require('../model/majors');
const { route } = require('./admin_majors');

router.get('/',async(req,res,next) =>{
    try {
        const data = await Sub.find();
        res.render('admin/subjects',{
            subs: data
        });
    } catch (error) {
        console.log(error)
    }
});

router.get('/add',async(req,res,next) =>{
    try {
        const m = await Major.find();
        res.render('admin/add_subjects',{
            majors: m
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/add',async(req,res,next) =>{
    try {
        const title = req.body.title;
        const slug = title;
        const content = req.body.content;
        const major = req.body.major;

        req.checkBody('title',"Title must an value").notEmpty();
        req.checkBody('content',"Content must an value").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            const m = await Major.find();
            res.render('admin/add_subjects',{
                errors: errors,
                majors: m
            })
        }else{
            const data = await Sub.findOne({slug:slug});
            const m2 = await Major.find();
            if(data){
                req.flash('danger',"Title exists!!");
                res.render('admin/add_subjects',{
                    majors: m2
                })
            }else{
                const sub = new Sub({
                    title: title,
                    slug: slug,
                    content: content,
                    major: major
                });
                await sub.save();
            }
            req.flash('success',"Created subject!");
            res.redirect('/admin/subjects')
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id',async(req,res,next) =>{
    try {
        const m = await Major.find();
        const data = await Sub.findById(req.params.id);
        res.render('admin/edit_subjects',{
            majors: m,
            title: data.title,
            content: data.content,
            major: data.major,
            id: data._id
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/edit/:id',async(req,res,next) =>{
    const m = await Major.find();
    try {
        const title = req.body.title;
        const slug = title;
        const content = req.body.content;
        const major = req.body.major;
        const id = req.params.id;

        req.checkBody('title',"Title must an value").notEmpty();
        req.checkBody('content',"Content must an value").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/edit_subjects',{
                errors: errors,
                title: title,
                content: content,
                id: id,
                majors: m,
                major: major
            })
        }else{
            const data = await Sub.findOne({slug:slug, _id: {'$ne':id}});
            if(data){
                req.flash('danger',"Title exists!!");
                res.render('admin/edit_subjects',{
                    title: title,
                    content: content,
                    id: id,
                    majors: m,
                    major: major
                });
            }else{
                const sub = await Sub.findById(id);
                sub.title= title;
                sub.slug = slug;
                sub.content = content;
                sub.major = major;

                await sub.save();
            }
            req.flash('success',"Edited subject!!");
            res.redirect('/admin/subjects');
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/delete/:id',async(req,res,next) =>{
    try {
        await Sub.findByIdAndRemove(req.params.id);
        req.flash('success',"Deleted subject!!");
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;