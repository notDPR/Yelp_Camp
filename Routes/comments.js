var express    = require("express") ;
var middleware = require("../middleware");

//var router  = express.Router() ; 
//if you are using (baadshah) in app.js then you need to add the below thing so that 'id' is not NULL
var router =  express.Router({mergeParams : true}) ;

var campground = require("../models/campground.js") ;
var comment = require("../models/comments.js") ;

// Comment New Form Route
router.get("/new", middleware.isloggedin ,function(req,res){
     //console.log(req.params) ;
    campground.findById(req.params.id,function(err,camp){
        if(err){ 
            console.log(err) ;
            req.flash("error","Something went wrong.");
        }
        else{ 
            res.render("comments/new.ejs" , {maal:camp}) ;
        }
    }) ;
}) ;

// Comment Create
router.post("/",middleware.isloggedin,function(req,res){
    // console.log(req.body) ;
    campground.findById(req.params.id,function(err,camp){
        if(err) console.log(err) ;
        else {
            comment.create(req.body.comment,function(err,comm){
                if(err) console.log(err);
                else {
                    comm.author.id       = req.user._id ;
                    comm.author.username = req.user.username ;
                    comm.save() ;
                    camp.comments.push(comm) ;
                    camp.save();
                    console.log(comm);
                    req.flash("success","Your Comment is posted.");
                    res.redirect("/campgrounds/" + camp._id) ;
                }
            });
        }
    });
});

// Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    comment.findById(req.params.comment_id , function(err,comment){
        if(err){
            console.log("Comment cannot be found in database");
            console.log(err);
            res.redirect("back") ;
        }
        else{
            res.render("comments/edit.ejs" , {camp_id : req.params.id , comment:comment}); 
        }
    });
    // req.params.id = id of current campground
});

// Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err,comm_upd){
        if(err){
            console.log(err) ;
            req.flash("error","Something went wrong.");
            res.redirect("back");
        }
        else{
            console.log("Comment updated");
            console.log(req.body.comment) ;
            req.flash("success","Your Comment is updated.");
            res.redirect("/campgrounds/" + req.params.id ) ;
        }
    });
});

// Delete Comment Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id , function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","Your Comment is deleted.");
            res.redirect("/campgrounds/" + req.params.id);
    // req.params.id = ID of campground in which this comment("req.params.comment_id") is present
        }
    });
});

// Middlewares are included in middleware/index.js 

module.exports = router ;