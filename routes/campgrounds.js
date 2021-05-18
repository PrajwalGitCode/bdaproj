var express = require("express");
var router = express.Router();
var campgro = require("../model/camp");
var comment = require("../model/comment");


router.get("/",function(req,res){
	res.render("landing");
});
router.get("/campgrounds",function(req,res){
	campgro.find({},function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("campground/campground",{campground:campground, currentuser: req.user});
		}
	});
});
router.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("campground/new");
});
router.post("/campgrounds",isLoggedIn,function(req,res){
	var image=req.body.image;
	var name=req.body.name;
	var desc=req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	}
	var newcampground = {name:name,image:image,description:desc,author:author}
	campgro.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});
router.get("/campgrounds/:id",function(req,res){
	campgro.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
		if(err){
				console.log(err);
		}else{
			res.render("campground/show",{campground:foundcampground});
		}
	});
});

//edit Router
router.get("/campgrounds/:id/edit",ownership,function(req,res){
	campgro.findById(req.params.id,function(err,foundcampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.render("campground/edit",{campground:foundcampground});
		}
	});
});
router.put("/campgrounds/:id",ownership,function(req,res){
	
	campgro.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updated){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//destroy Router
router.delete("/campgrounds/:id",ownership,function(req,res){
	campgro.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		res.redirect("/campgrounds");
	});
});

function ownership(req,res,next){
	if(req.isAuthenticated()){
		campgro.findById(req.params.id,function(err,foundcampground){
			if(err){
				res.redirect("back");
			} else {
				if(foundcampground.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
}

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;