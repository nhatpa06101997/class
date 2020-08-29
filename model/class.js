const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    title: {type:String, required:true},
    slug: {type:String},
    sub:{type:String},//option
});

module.exports = mongoose.model('Class',classSchema);