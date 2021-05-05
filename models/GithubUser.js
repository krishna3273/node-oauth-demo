const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    githubId:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('GithubUser',UserSchema)