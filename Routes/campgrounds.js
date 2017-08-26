var express     = require("express") ;
var router      = express.Router() ; 
var moment      = require("moment-timezone");
var campground  = require("../models/campground.js") ;
var middleware  = require("../middleware");
// var middleware = rewuire("../middleware/index.js");  
//both ways are correct - by requiring a directory , index.js file inside that directory is automatically required.

// Index Route - shows all campgrounds
router.get("/" , function(req,res){
    campground.find({}, function(err,campground){
        // console.log(campground) ;
       if(err) console.log("Error in retrieving campgrounds from database") ;
       else  res.render("campgrounds/campgrounds.ejs" , {camps : campground , current_user : req.user }) ;
    });
});

// New Campground Form Route
router.get("/new" , middleware.isloggedin ,function(req,res){
    campground.find({}, function(err,campground){
       if(err) console.log("Error in retrieving campgrounds from database") ;
       else res.render("campgrounds/new.ejs" , {camps : campground}) ;
    });
});
    
// Create New Campground
router.post("/" , middleware.isloggedin ,function(req,res){
   console.log("REQ.BODY = "+req.body) ; 
//   campGround.push({name: req.body.name , image: req.body.img_url}) ;
    var author = {
        id : req.user._id ,
        username : req.user.username
    };
                 campground.create({
                    name        : req.body.name , 
                    image       : req.body.img_url , 
                    description : req.body.description ,
                    price       : req.body.price ,
                    place       : req.body.place ,
                    author      : author,
                    date        : moment().tz("Asia/Colombo").format('llll')
                }, 
                    function(err,campgrounds){
                        if(err) console.log(err) ;
                        else {
                            console.log(campgrounds);
                            res.redirect("/campgrounds") ;
                        }
                });
//   res.render("campgrounds/campgrounds.ejs" , {camps:campGround}) ;
});

var googleMapsClient = require("@google/maps").createClient({
    key : process.env.API_KEY
    });

// Show Route - shows info about the selected campground
router.get("/:id" ,function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err , camp){
        if(err) console.log(err) ;
        else {
            var adress = {} ;
            var location = camp.name + " , " + camp.place ;
            googleMapsClient.geocode({address : location} ,function(err , response){
                if(err) console.log(err);
                else{
                     adress.lat   = response.json.results[0].geometry.location.lat ;
                     adress.lng   = response.json.results[0].geometry.location.lng ;
                    
                    console.log(camp);
                    res.render("campgrounds/show.ejs",{camp_sel:camp , lat:adress.lat , lng:adress.lng}) ;
                }
            });
        }
    }) ;
});


// Edit Campground Route
router.get("/:id/edit" ,middleware.checkCampgroundOwnership, function(req,res){
    campground.findById(req.params.id , function(err , camp_sel){
       if(err){ 
           console.log(err);
           req.flash("error","Campgrounds not found");
           res.redirect("/campgrounds");
       } 
       else{
           res.render("campgrounds/edit.ejs" , {camp_edit : camp_sel});
       }
    });
});

// Update Campground Route 
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    campground.findByIdAndUpdate(req.params.id , req.body.campground,function(err,camp_upd){
        if(err){ 
            console.log(req.params.name + "NOT UPDATED !");
            console.log(err) ;
            req.flash("error","Something went wrong.");
        }
        else {
            console.log(req.params.name + " is UPDATED !");
            
            camp_upd.name = "CHANGED" ;
            
            req.flash("success","Campground Updated.");
        }
        res.redirect("/campgrounds/" + req.params.id ) ;
    });
});

// Delete Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            console.log(req.params.name + "is NOT DELETED");
            console.log(err);
            req.flash("error","Something went wrong");
        }
        else {
            req.flash("success","Campground deleted.");
        }
        res.redirect("/campgrounds");
    });
});

// Middlewares are included in middleware/index.js 

module.exports = router ;