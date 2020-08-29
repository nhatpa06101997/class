const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const expressValida = require('express-validator');
const path = require('path');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://nhatpa0610:nhatpa06101997@cluster0-lfiza.mongodb.net/test9?retryWrites=true&w=majority',
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(morgan('dev'));
// app.use('/public',express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.locals.errors = null;
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
}));
app.use(expressValida({
    errorFormatter: (param,msg,value) =>{
        const namespace = param.split('.')
        ,root = namespace.shift()
        ,formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        }
    },
    customValidators:{
        isImage: function(value,filename){
            const extention = (path.extname(filename)).toLowerCase();
            switch(extention) {
                case '.jpg':
                    return ' .jpg';
                case '.jpeg':
                    return ' .jpeg';
                case '.png':
                    return ' .png';
                case '':
                    return ' .jpg';
                default:
                    return false;
            }
        }
    }
}));
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

require('./config/passport')(passport);
//middleware passport
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next) {
    res.locals.user = req.user || null;
    next();
})

const adminMajor = require('./routes/admin_majors');
const adminSub = require('./routes/admin_subjects');
const adminClass = require('./routes/admin_class');
const adminUser = require('./routes/admin_users');
const adminStu = require('./routes/admin_students');
const edu = require('./routes/edu');
const user = require('./routes/user');

app.use('/admin/majors',adminMajor);
app.use('/admin/subjects',adminSub);
app.use('/admin/class',adminClass);
app.use('/admin/users',adminUser);
app.use('/admin/students',adminStu);
app.use('/',edu);
app.use('/users',user);

app.listen(port,()=>{
    console.log("Listening in port: ",port);
});