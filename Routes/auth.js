var express  = require("express") ;
var router   = express.Router() ; 
var user     = require("../models/user.js");
var passport = require("passport");

// Root Route
router.get("/" , function(req,res){
    console.log(req.user);
    res.render("landing.ejs") ;
}) ;

// Register Form Route
router.get("/register",function(req,res){
    res.render("authentication/register.ejs") ;
});

// Sign Up Logic
router.post("/register",function(req,res){
    var new_user = new user({ username : req.body.username });
    user.register( new_user , req.body.password, 
        function(err , naya_user){
            if(err) 
            { 
                console.log(err) ;
                req.flash("error",err.message);
                return res.redirect("/register") ; 
            } 
            else 
            {
                // console.log(naya_user) ;
                passport.authenticate("local")(req,res,
                    function(){             // user.username (right below)
                        req.flash("success",new_user.username +" is successfully Registered.");
                        res.redirect("/campgrounds");
                    });
            }
        }  
    );
});

// Login Form Route
router.get("/login",function(req,res){
    res.render("authentication/login.ejs");
});

// Login Logic
router.post("/login", 
        passport.authenticate("local" ,{
            successRedirect : "/campgrounds" ,
            failureRedirect : "/login"
        } ),
        function(req,res){}
);

// Logout Route
router.get("/logout",function(req,res){
   req.logout();
   req.flash("error","Logged Out");
   res.redirect("/");
});

module.exports = router ;