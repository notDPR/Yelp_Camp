var mongoose = require("mongoose") ;

var campground = require("./models/campground.js") ;
var comment = require("./models/comments.js") ;

var data = [{name: "Eg1" , image:"https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg" , description:"Blah Blah Blah"}
    ,{name :"Eg2",image:"https://farm8.staticflickr.com/7266/7626416312_eb51133bcc.jpg",description:"Acha ji"
    }] ;

function seedDB(){
    // Removes all campgrounds
    campground.remove({},function(err){
        if(err) console.log(err) ;
        else console.log("All Campgrounds Removed!") ;
    }) ;
    //Removes all Comments
    comment.remove({},function(err){
        if(err) console.log(err) ;
        else console.log("All Comments Removed!") ;
    }) ;
    
    for(var i=0;i<data.length;i++)
     {
        // campground.create(data[i],function(err,this_camp){
        // if(err) console.log(err);
        // else {console.log("Campground Added") ;
             
        //     //  Adding comments
        //     // comment.create({text:"This place is great!" , author:"Homer"},function(err,comm){
        //     //      if(err) console.log(err) ;
        //     //      else{
        //     //          this_camp.comments.push(comm) ;
        //     //          this_camp.save() ;
        //     //          console.log("New Comment added"); }}) ;
                 
        //     comment.create({text:"This place is filthy!" , author:"Frank"},function(err,comm){
        //          if(err) console.log(err) ;
        //          else{
        //             this_camp.comments.push(comm) ;
        //             this_camp.save() ;
        //             console.log("New Comment added") ;
        //         }});
        //  }});
     }
}
module.exports = seedDB ;