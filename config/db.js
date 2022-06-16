const mongoose = require('mongoose');


function connectToDB(){
    try{
        mongoose.connect('mongodb://localhost:27017/dating', ()=>{
            console.log('Connection To DB was successful');
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectToDB;