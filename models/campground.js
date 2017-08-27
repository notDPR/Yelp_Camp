var mongoose = require("mongoose") ;

var campgroundSchema = new mongoose.Schema({
    name  : String ,
    image : String ,
<<<<<<< HEAD
    date  : String ,
    place : String ,
=======
>>>>>>> 117f6192a2b4d80a9160743606f98a283938c05b
    price : String ,
    description : String ,
    author : {
        id: {
          type : mongoose.Schema.Types.ObjectId ,
          ref : "user"
        },
        username : String
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "comment"
    }]
}) ;
var campground = mongoose.model("campground" , campgroundSchema) ;

module.exports = campground ;