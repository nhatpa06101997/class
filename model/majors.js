const mongoose = require('mongoose');

const maSchema = mongoose.Schema({
    title: {type:String, required:true},
    slug:{type:String}
});
//cntt, ks, nha hang, du lich

module.exports = mongoose.model('Major',maSchema);