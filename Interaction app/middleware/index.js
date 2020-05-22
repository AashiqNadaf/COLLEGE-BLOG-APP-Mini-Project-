var User = require("../modles/user"),
Student  = require("../modles/student");

var middlewareobj = {};

middlewareobj.checkUserOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.params.id, function(err, foundUser){
			if(err || !foundUser){
				req.flash("error", "Profile not found");
				res.redirect("back");
			}else{
				//is valid user
				if(foundUser._id.equals(req.user._id)){
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

middlewareobj.checkStudentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Student.findById(req.params.stud_id, function(err, foundStudent){
			if(err|| !foundStudent){
				console.log(err);
				res.redirect("back");
			}else{
				//does user own student?
				if(foundStudent.proctor.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You dont have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that!");
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

middlewareobj.isAdmin = function(req, res, next){
	if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                //console.log(err);
                req.flash("error", "User not found!");
                res.redirect("back");
            }else{
                if(foundUser.isAdmin){
                    return next();
                }else{
                    req.flash("error", "Admin need to b loggin to do that!");
                    res.redirect("/login");  
                }
            }
        })
		
	}
	  
}

middlewareobj.isNotAdmin = function(req, res, next){
	if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser){
                //console.log(err);
                req.flash("error", "User not found!");
                res.redirect("back");
            }else{
                if(!(foundUser.isAdmin)){
                    return next();
                }else{
                    req.flash("error", "Admin need to b loggin to do that!");
                    res.redirect("/login");  
                }
            }
        })
		
	}
	  
}

module.exports = middlewareobj;