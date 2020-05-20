var Blog = require("../modles/Blogs");
var User = require("../modles/user");

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