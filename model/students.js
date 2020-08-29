const mongoose = require('mongoose');

const stuSchema = mongoose.Schema({
    name:{type:String},//name User 
    //method GET: 
    //const u = [];
    //const user = User.find() 
    //for()-> if(user[i].class == ""){u.push({name: user[i].name})} 
    //res.render({users: u})
    //option sẽ chứa các user có trong mảng u
    sex:{type:String},//stu.sex = user.sex 
    major:{type:String},// chọn sau
    sub:{type:String},//stu.sub = user.sub 
    class:{type:String},// lấy cái sub hiện tại để tìm cái class
    image:{type:String}
});
//phần add chỉ có option name hiện còn lại ẩn trong api
//edit hiện toàn bộ để chỉnh sửa
//all option


module.exports = mongoose.model('Student',stuSchema);