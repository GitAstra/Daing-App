const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },    
    blockList: {
        type: Array,
        default: []
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    likes: {
        type: Array,
        default: []
    }
})

module.exports = new mongoose.model('User', UserSchema);