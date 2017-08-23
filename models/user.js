var mongoose              = require("mongoose") ;
var passportLocalMongoose = require("passport-local-mongoose"); 

var userSchema = new mongoose.Schema({
    username : String ,
    password : String
});

userSchema.plugin(passportLocalMongoose);
// Add passport related mongoose methods to user  

module.exports = mongoose.model("user" , userSchema ) ;