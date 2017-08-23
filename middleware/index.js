// Place for all the Middlewares
var campground = require("../models/campground.js");
var comment    = require("../models/comments.js");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        campground.findById(req.params.id,function(err,camp){
            if(err){
                console.log(err);
                req.flash("error","Campgrounds not found.");
                res.redirect("back");
            }
            else{
                if(camp.author.id.equals(req.user._id)){
                // cant use "==" or "===" as one is "object" and the other is "string" respectively
                    next();
                }
                else{
                    console.log("Author of " + camp.name + " is NOT " + req.user.username);
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        console.log("You need to be logged in first !");
        req.flash("error","You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        comment.findById(req.params.comment_id,function(err,comm){
            if(err){
                console.log(err);
                req.flash("error","Campgrounds not found.");
                res.redirect("back");
            }
            else{
                if(comm.author.id.equals(req.user._id)){
                // cant use "==" or "===" as one is "object" and the other is "string" respectively
                    next();
                }
                else{
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        console.log("You need to be logged in first !");
        req.flash("error","You need to be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.isloggedin = function(req,res,next)
{
    if(req.isAuthenticated()) next();
    else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}

module.exports = middlewareObj ;