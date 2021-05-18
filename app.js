var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var campgro = require("./model/camp");
var seeddb = require("./seeds");
var comment = require("./model/comment");
var passport = require("passport");
var localstrategy = require("passport-local");
var User = require("./model/user");
var methodoverride = require("method-override");

var commentroutes = require("./routes/comments");
var campgroundroutes = require("./routes/campgrounds");
var authroutes = require("./routes/index");


//seeddb();//seeddb
mongoose.connect("mongodb://localhost/yelp_camp",{useUnifiedTopology:true,useNewUrlParser: true,useCreateIndex:true});
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
//pasport configuration
app.use(require("express-session")({
	secret:"yashashree is still beautifull",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentuser = req.user;
	next();
});

app.use(authroutes);
app.use(campgroundroutes);
app.use(commentroutes);


app.listen(3000,function(){
	console.log("server has started");
});