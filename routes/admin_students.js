const express = require('express');
const router = express.Router();
const fs = require('fs-extra');

const User = require('../model/users');
const Student = require('../model/students');
const Sub = require('../model/subjects');
const Class = require('../model/class');

router.get('/',async(req,res,next) =>{
    try {
        const data = await Student.find();
        res.render('admin/students',{
            stus: data
        })
    } catch (error) {
        console.log(error)
    }
});

router.get('/add',async(req,res,next) =>{
    try {
        //chấp vá
        // const user = await User.find({status: "0"});

        let user = await User.find();
        const students = await Student.find();
        students.forEach(item => {
            user = user.filter(itemU=>{
                return item.name != itemU.name;
            });
        });
        res.render('admin/add_students',{
            users: user
        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/add',async(req,res,next) =>{
    try {
        const name = req.body.name;
        const u = await User.findOne({name: name});
        const sub = await Sub.findOne({slug: u.subject})

        const stu = new Student({
            name: u.name,
            sex: u.sex,
            major: sub.major,
            sub: u.subject,
            class: null,
            image: ""
        });
        await stu.save();
        u.status = "1";
        await u.save();

        
        await fs.mkdirSync('public/product_images/' + stu._id,{recursive:true});
        await fs.mkdirSync('public/product_images/' + stu._id + '/gallery',{recursive:true});
        await fs.mkdirSync('public/product_images/' + stu._id + '/gallery/thumbs',{recursive:true});

        req.flash('success',"Created Student!!");
        res.redirect('/admin/students')
    } catch (error) {
        console.log(error)
    }
});

router.get('/edit/:id',async(req,res,next) =>{
    try {
        const stu = await Student.findById(req.params.id);
        const sub = await Sub.find();
        const cl = await Class.find({sub: stu.sub})
        res.render('admin/edit_students',{
            stu: stu,
            sub: stu.sub,
            subs: sub,
            cl: cl,
            id: stu._id,
            clss: stu.class

        })
    } catch (error) {
        console.log(error)
    }
});

router.post('/edit/:id',async(req,res,next) =>{
    const stu = await Student.findById(req.params.id);
    const subs = await Sub.find();
    const cl = await Class.find({sub: stu.sub})
    try {
        const id = req.params.id;
        const name = req.body.name;
        const sex = req.body.sex;
        const major = req.body.major;
        const sub = req.body.sub;
        const clas = req.body.class;

        var imageFile;
        if(!req.files){
            imageFile = ""
        }else{
            imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
        }

        req.checkBody('image',"You must upload an image").isImage(imageFile);

        const errors = await req.validationErrors();
        if(errors){
            res.render('admin/edit_students',{
                errors: errors,
                stu: stu,
                sub: stu.sub,
                subs: subs,
                cl: cl,
                id: stu._id,
                clss: stu.class
            })
        }else{
            const data = await Student.findOne({name:name, _id: {'$ne':id}});
            if(data){
                req.flash('danger',"Student exists");
                res.render('admin/edit_students',{
                    stu: stu,
                    sub: stu.sub,
                    subs: subs,
                    cl: cl,
                    id: stu._id,
                    clss: stu.class
                });
            }else{
                const student = await Student.findById(id);
                student.name = name;
                student.sex = sex;
                student.major = major;
                student.sub = sub;
                student.class = clas;
                student.image = imageFile;

                await student.save();

                if(imageFile != ""){
                    var productImage = req.files.image;

                    var path = 'public/product_images/' + student._id + '/' + imageFile;

                    await productImage.mv(path);
                }

                req.flash('success',"Edited success!!");
                res.redirect('/admin/students');
            }
        }
    } catch (error) {
        console.log(error)
    }
});

router.get('/delete/:id',async(req,res,next) =>{
    try {
        const id = req.params.id;
        await Student.findByIdAndRemove(id);

        var path = 'public/product_images/' + id
        await fs.remove(path);

        req.flash('success',"Deleted !!");
        res.redirect('back');
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;