const express = require('express');
const router = express.Router();

const Class = require('../model/class');
const Sub = require('../model/subjects');

router.get('/',async(req,res,next) =>{
    try {
        const data =await Class.find();
        res.render('admin/class',{
            cl: data
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/add',async(req,res,next) =>{
    try {
        const s = await Sub.find();
        res.render('admin/add_class',{
            subs: s
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/add',async(req,res,next) =>{
    const s = await Sub.find();
    try {
        const title = req.body.title;
        const slug = title;
        const sub = req.body.sub;

        req.checkBody('title',"Title must an value").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/add_class',{
                errors: errors,
                subs: s
            })
        }else{
            const data = await Class.findOne({slug:slug});
            if(data){
                req.flash('danger',"Title exists");
                res.render('admin/add_class',{
                    subs: s
                });
            }else{
                const cl = new Class({
                    title: title,
                    slug: slug,
                    sub: sub
                });
                await cl.save();
            }
            req.flash('success',"Created class!!");
            res.redirect('/admin/class')
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id',async(req,res,next)=>{
    try {
        const id = req.params.id;
        const cl = await Class.findById(id);
        const s = await Sub.find();

        res.render('admin/edit_class',{
            id: cl._id,
            title: cl.title,
            subs: s,
            sub: cl.sub
        });
    } catch (error) {
        console.log(error)
    }
});

router.post('/edit/:id',async(req,res,next)=>{
    const s = await Sub.find();
    try {
        const id = req.params.id;
        const title = req.body.title;
        const slug = title;
        const sub = req.body.sub;

        req.checkBody('title',"Title must an value").notEmpty();

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/edit_class',{
                errors: errors,
                sub: sub,
                subs: s,
                id: id,
                title: title
            })
        }else{
            const data = await Class.findOne({slug:slug, _id:{'$ne':id}});
            if(data){
                req.flash('danger',"Title exists!");
                res.render('admin/edit_class',{
                    sub: sub,
                    subs: s,
                    id: id,
                    title: title
                });
            }else{
                const cl = await Class.findById(id);
                cl.title = title;
                cl.slug = slug;
                cl.sub = sub;

                await cl.save();
            }
            req.flash('success',"Edited class!!");
            res.redirect('/admin/class');
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/delete/:id',async(req,res,next)=>{
    try {
        await Class.findByIdAndRemove(req.params.id);
        req.flash('success',"Deleted class!!");
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;