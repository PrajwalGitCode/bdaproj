var mongoose = require("mongoose");
var campgro = require("./model/camp");
var comment = require("./model/comment");
var data = [
	{
		name:"kaladin",
		image:"https://i.pinimg.com/originals/a4/38/a8/a438a887db8c0fcf3fbfa0f7933b1969.jpg",
		description:"The Knights Radiant, commonly known as Radiants, were a military organization of ten consecrated orders, centered at Urithiru on Roshar.[1] Commonly believed to have betrayed mankind on the Day of Recreance, they are now referred to as the Lost Radiants ... traitors.[2] Yet, the orders were once one. Not without problems or strife, but focused.[1] Their symbol was a golden hourglass shape of eight spheres connected with two at the center. This shape was also sometimes referred to as the Double Eye of the Almighty in Vorinism."
	},
	{
		name:"shallan",
		image:"https://vignette.wikia.nocookie.net/stormlightarchive/images/f/ff/ShallanPainting.jpg/revision/latest?cb=20140104012916",
		description:"The Knights Radiant, commonly known as Radiants, were a military organization of ten consecrated orders, centered at Urithiru on Roshar.[1] Commonly believed to have betrayed mankind on the Day of Recreance, they are now referred to as the Lost Radiants ... traitors.[2] Yet, the orders were once one. Not without problems or strife, but focused.[1] Their symbol was a golden hourglass shape of eight spheres connected with two at the center. This shape was also sometimes referred to as the Double Eye of the Almighty in Vorinism."
	},
	{
		name:"dalinar",
		image:"https://i.imgur.com/YBkHGB0.jpg",
		description:"The Knights Radiant, commonly known as Radiants, were a military organization of ten consecrated orders, centered at Urithiru on Roshar.[1] Commonly believed to have betrayed mankind on the Day of Recreance, they are now referred to as the Lost Radiants ... traitors.[2] Yet, the orders were once one. Not without problems or strife, but focused.[1] Their symbol was a golden hourglass shape of eight spheres connected with two at the center. This shape was also sometimes referred to as the Double Eye of the Almighty in Vorinism."
	}
];
function seedDB(){
	campgro.remove({},function(err){
		if(err){
			console.log(err);
		}else{
			data.forEach(function(seed){
				campgro.create(seed,function(err,campground){
					if(err){
						console.log(err);
					}else{
						console.log("added a data");
						comment.create(
							{
								text:"stay with honor and unite them",
								author:"almighty"
							},function(err,comment){
								if(err){
									console.log(err);
								}else{
									campground.comments.push(comment);
									campground.save();
									console.log("created new comment");
								}
							}
						);
					}
				});
			});
		}
	});
};
module.exports = seedDB;