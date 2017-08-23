var express                  = require("express") ,
    app                      = express(),
    passport                 = require("passport"),
    localStrategy            = require("passport-local"),
    bodyparser               = require("body-parser") ,
    mongoose                 = require("mongoose") ,
    expressSession           = require("express-session"),
    methodOverride           = require("method-override"),
    user                     = require("./models/user.js"),
    flash                    = require("connect-flash") ;

// Requiring Routes 
var commentRoutes    = require("./Routes/comments.js"),
    campgroundRoutes = require("./Routes/campgrounds.js"),
    authRoutes       = require("./Routes/auth.js") ;

//mongoose.connect("mongodb://localhost/yelp_camp") ;
mongoose.connect("mongodb://himanshu:my1stwebsite@ds157723.mlab.com:57723/yelp_camp") ;
//mongodb://himanshu:my1stwebsite@ds157723.mlab.com:57723/yelp_camp
app.use(bodyparser.urlencoded({extended :true})) ;
app.use(express.static(__dirname+"/public")) ;
app.use(bodyparser.urlencoded({extended :true})) ;
app.use(expressSession({
    secret : "Gangadhar hi Shaktimaan hai",
    resave : false ,
    saveUninitialized : false
}));
app.use(passport.initialize()); // required to use passport in express
app.use(passport.session()) ;
passport.use(new localStrategy(user.authenticate()));
app.use(methodOverride("_method"));
app.use(flash());

// coding and decoding of data in session in passport
passport.serializeUser(user.serializeUser()); 
passport.deserializeUser(user.deserializeUser());

// var seedDB = require("./seeds.js") ;
// seedDB() ;   // remove all campgrounds

// Creating a middleware for every ROUTE
app.use(function(req,res,next){
    res.locals.current_user  = req.user ;
    res.locals.flash_error = req.flash("error") ;
    res.locals.flash_success = req.flash("success") ;
    next();
});

//app.use(authRoutes);
app.use("/",authRoutes) ;

//app.use(campgroundRoutes) ;
app.use("/campgrounds" , campgroundRoutes) ; // -- to omit the use of 'campgrounds' in every address in Routes/campgrounds.js

//app.use(commentRoutes) ;
app.use("/campgrounds/:id/comments",commentRoutes) ; // (baadshah) -- to omit the use of 'campgrounds/:id/comments' in every address in Routes/campgrounds.js

app.listen(process.env.PORT , process.env.IP , function(){
    console.log("Yelp Camp's Server is ON") ;
}) ;  // Server start