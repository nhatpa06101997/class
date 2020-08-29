const mongoose = require('mongoose');

const subSchema = mongoose.Schema({
    title: {type:String, required:true},
    slug: {type: String},
    content: {type:String, required:true},
    major: {type:String}//option
});

module.exports = mongoose.model('Subject',subSchema);