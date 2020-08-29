const express = require('express');
const router = express.Router();

const Major = require('../model/majors');
const Sub = require('../model/subjects');
const Stu = require('../model/students');
const Cl = require('../model/class');

router.get('/',async(req,res,next) =>{
    try {
        const m = await Major.find();
        const s = await Sub.find();
        res.render('home/class',{
            title: "Class",
            majors: m,
            subs: s
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/:slug',async(req,res,next) =>{
    try {
        const slug = req.params.slug;
        const data = await Sub.findOne({slug:slug});
        let cl = await Cl.find({sub:slug});
        const stu = await Stu.find();

        res.render('home/subjects',{
            title: data.title,
            content: data.content,
            cl: cl,
            stus: stu
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/:slug/:id',async(req,res,next) =>{
    try {
        const data = await Stu.findById(req.params.id);
        res.render('home/details_student',{
            title: data.name,
            stus: data
        })
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;