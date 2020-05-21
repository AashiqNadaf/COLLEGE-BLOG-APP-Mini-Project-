var express = require("express");
var router  = express.Router();
var passport = require("passport");
//var User = require("../modles/user");
var async = require("async"),
User       =   require("../modles/user"),
Student    = require("../modles/student"),
nodemailer			= require("nodemailer"),
crypto				= require("crypto");
var middleware = require("../middleware");

//root route
router.get("/", middleware.isLoggedIn,function(req, res){
	res.render("allUser/index");
});




router.post("/:id/feeDone/:stud_id", middleware.isAdmin,function(req, res){
	Student.findByIdAndUpdate(req.params.stud_id,{isFeePaid: true }, function(err, foundStudent){
		if(err || !foundStudent){
			//console.log(err);
			req.flash("error", "Something went wrong or not verified user!");
			res.redirect("back");
		}else{
			req.flash("success", "Updated Successfully!");
			res.redirect("/user/"+req.user._id);
		}
	})
})

router.post("/:id/feeUndone/:stud_id", middleware.isAdmin,function(req, res){
	Student.findByIdAndUpdate(req.params.stud_id,{isFeePaid: false }, function(err, foundStudent){
		if(err){
			console.log(err || !foundStudent);
			req.flash("error", "Something went wrong or not verified user!");
			res.redirect("back");
		}else{
			req.flash("success", "Updated Successfully!");
			res.redirect("/user/"+req.user._id);
		}
	})
})

router.get("/:id", middleware.isLoggedIn,function(req, res){
		Student.find({}).sort({noCaps: 1}).exec(function(err, allStudents){
			if(err || !allStudents){
				//console.log(err);
				req.flash("error", "No students found!");
				res.redirect("back");
			}else{
				res.render("allUser/students", {students: allStudents});
			}
		});
});





module.exports = router;