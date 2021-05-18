var express = require("express");
var router = express.Router();
var campgro = require("../model/camp");
var comment = require("../model/comment");

router.get("/campgrounds/:id/comment/new",isLoggedIn,function(req,res){
	campgro.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comment/new",{campground:campground});
		}
	});
});
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	campgro.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});
//comment edit route
router.get("/campgrounds/:id/comments/:commentId/edit",commentownership,function(req,res){
	comment.findById(req.params.commentId,function(err,foundcomment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comment/edit",{campground_id:req.params.id,comment:foundcomment});
		}
	});
});
router.put("/campgrounds/:id/comments/:commentId",commentownership,function(req,res){
	comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,updat){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//delete comment
router.delete("/campgrounds/:id/comments/:commentId",commentownership,function(req,res){
	comment.findByIdAndRemove(req.params.commentId,function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function commentownership(req,res,next){
	if(req.isAuthenticated()){
		comment.findById(req.params.commentId,function(err,foundcomment){
			if(err){
				res.redirect("back");
			} else {
				if(foundcomment.author.id.equals(req.user._id)){
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

module.exports = router;
