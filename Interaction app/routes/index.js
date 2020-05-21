var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../modles/user");
var async = require("async"),
nodemailer			= require("nodemailer"),
crypto				= require("crypto");
var middleware = require("../middleware");

//root route
router.get("/", function(req, res){
	res.render("index");
});


//=============================================
//AUTH ROUTES
//=====================================

//show register form route
router.get("/register", function(req, res){
	res.render("allUser/register");
});


//handle signup form
router.post("/register", function(req, res){
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email
	});
	if(req.body.adminCode === "admin_code123"){
		newUser.isAdmin = true;
	}
	if(req.body.userCode === "user_code123"){
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				return res.render("allUser/register", {error: err.message});
			}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Successfull registerd to Interaction page, "+user.username);
				res.redirect("/user");
			});
		});
	}else{
		//req.flash("error", "You are not valid user!");
		res.redirect("/register");
	}
	
});

//show login form
router.get("/login", function(req, res){
	res.render("allUser/login");
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/user/",
		failureRedirect: "/login"
	}), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out successfully!");
	res.redirect("/");
});

//forgot password
router.get("/forgot", function(req, res){
	res.render("forgot");
});

router.post("/forgot", function(req, res, next){
	async.waterfall([
		function(done){
			crypto.randomBytes(20, function(err, buff){
				var token = buff.toString('hex');
				done(err, token);
			});
		},
		function(token, done){
			User.findOne({email: req.body.email}, function(err, user){
				if(!user){
					req.flash("error", "No account with that email exist!");
					return res.redirect("/forgot");
				}
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000;

				user.save(function(err){
					done(err, token, user);
				});
			});
		},
		function(token, user, done){
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "mailblogmproj@gmail.com",
					pass: "mailblog"
				}
			});
			var mailOptions = {
				to: user.email,
				from: "ashmanimkar@gmail.com",
				subject: "Msrit blog password reset",
				text: "You are receiving this because you (or someone else) have requested the reset of the password.\n"+
				"Please click on the following link, or paste this into your browser to complete the process.\n"+
				"http://"+ req.headers.host + "/reset/"+ token +"\n\n"+
				"If you did not request this please ignore this email and your password will ramin unchanged."
			};
			smtpTransport.sendMail(mailOptions, function(err){
				console.log("mail sent");
				req.flash("success", "An e-mail has been sent to "+user.email+" with further instructions!");
				done(err, "done");
			});
		}
	], function(err){
		if(err){
			return next(err);
		}else{
			res.redirect("/forgot");
		}
	});
});

router.get("/reset/:token", function(req, res){
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
		if(!user){
			req.flash("error", "Password reset token is invalid or has expired.");
			return res.redirect("/forgot");
		}
		res.render("reset", {token: req.params.token});
	});
});

router.post("/reset/:token", function(req, res){
	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user){
				if(!user){
					req.flash("error", "Password reset token is invalid or has expired.");
					return res.redirect("/forgot");
				}
				if(req.body.password === req.body.confirm){
					user.setPassword(req.body.password, function(err){
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err){
							req.logIn(user, function(err){
								done(err, user);
							});
						});
					});
				} else {
					req.flash("error", "Password do not match");
					return res.redirect("back");
				}
			});
		},
		function(user, done){
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: "mailblogmproj@gamil.com",
					pass: "mailblog"
				}
			});
			var mailOptions = {
				to: user.email,
				from: "ashmanimkar@gmail.com",
				subject: "Your password has been changed",
				text: "Hello\n\n"+
				"This is the confirmation that the password for your account "+ user.email + " has just been updated"
			};
			smtpTransport.sendMail(mailOptions, function(err){
				req.flash("success", "Success! Your password has been changed.");
				done(err);
			});
		}
	], function(err){
		res.redirect("/user");
	});
});

module.exports = router;