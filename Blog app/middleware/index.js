var Blog = require("../modles/Blogs");
var User = require("../modles/user");
var Event = require("../modles/Events");
var Project = require("../modles/Project");
var Exam = require("../modles/Exams");
var Job = require("../modles/Jobs");

// all middleware goes here
var middlewareobj = {};

middlewareobj.checkBlogOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err || !foundBlog){
				req.flash("error", "Blog not found");
				res.redirect("back");
			}else{
				//does user own the Blog?
				if(foundBlog.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be loggedin to do that!");
		res.redirect("back")
	}    
}

middlewareobj.checkEventOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Event.findById(req.params.id, function(err, foundEvent){
			if(err || !foundEvent){
				req.flash("error", "Event not found");
				res.redirect("back");
			}else{
				//does user own the Event?
				if(foundEvent.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be loggedin to do that!");
		res.redirect("back")
	}    
}

middlewareobj.checkProjectOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Project.findById(req.params.id, function(err, foundProject){
			if(err || !foundProject){
				req.flash("error", "Project not found");
				res.redirect("back");
			}else{
				//does user own the Event?
				if(foundProject.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be loggedin to do that!");
		res.redirect("back")
	}    
}

middlewareobj.checkExamOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Exam.findById(req.params.id, function(err, foundExam){
			if(err || !foundExam){
				req.flash("error", "Exam not found");
				res.redirect("back");
			}else{
				//does user own the Event?
				if(foundExam.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be loggedin to do that!");
		res.redirect("back")
	}    
}

middlewareobj.checkJobOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Job.findById(req.params.id, function(err, foundJob){
			if(err || !foundJob){
				req.flash("error", "Company not found");
				res.redirect("back");
			}else{
				//does user own the Event?
				if(foundJob.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be loggedin to do that!");
		res.redirect("back")
	}    
}



middlewareobj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to b loggin to do that!");
	res.redirect("/login");    
}


middlewareobj.isAdminTrue = function(req, res, next){
	User.findById(req.user._id, function(err, adminUser){
		//console.log(req.user.id);
		if(adminUser.isAdmin){
			return next();
			
		}else{
			req.flash("error", "You are not a admin!");
			res.redirect("/blogs");
		}
	});
}

module.exports = middlewareobj;