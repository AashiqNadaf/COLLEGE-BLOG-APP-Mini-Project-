var express 	= require("express");
var router  	= express.Router();
var Job 		= require("../modles/Jobs");
var middleware 	= require("../middleware");

router.get("/", function(req, res){
	Job.find({}).sort({created: -1}).exec(function(err, allJobs){
		if(err){
			console.log(err);
		}else{
			res.render("Jobs/index", {jobs: allJobs});
		}
	})
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("Jobs/new")
});

//create
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var cmpny = req.body.company;
    var img = req.body.image;
    var dt = req.body.date;
    var brnch = req.body.branch;
    var requr = req.sanitize(req.body.reqr);
	var desc = req.sanitize(req.body.description);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newJob = {
        company: cmpny, 
        image: img, 
        description: desc, 
        author: author, 
        reqr: requr,
        branch: brnch,
        date: dt
    };
	//Create a new blog and save to db
	Job.create(newJob, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to blogs
			req.flash("success", "Placement details added successfully!");
			res.redirect("/jobs");
		}
	});
});

//SHOWS MORE INFO ABOUT ONE BLOG
router.get("/:id", function(req, res){
	//find the blog with provided id
	Job.findById(req.params.id, function(err, foundJob){
		if(err || !foundJob){
			req.flash("error", "Details not found!");
			res.redirect("/jobs");
		}else{
			//RENDER SHOW TEMPLATE WITH THAT BLOG
			res.render("Jobs/show", {job: foundJob});
		}
	});
});

//EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkJobOwnership, function(req, res){

	Job.findById(req.params.id, function(err, foundJob){
		if(err || !foundJob){
			req.flash("error", "Placement details not found");
			res.redirect("/jobs");
		}else{
			res.render("Jobs/edit", {job: foundJob});	
		}
	});
});

//UPDATE BLOG ROUTE
router.put("/:id", middleware.checkJobOwnership, function(req, res){
    req.body.job.description= req.sanitize(req.body.job.description);
    req.body.job.reqr= req.sanitize(req.body.job.reqr);
//find and update the correct blog
	Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updateJob){
		if(err){
			//console.log(err);
			req.flash("error", "Something went wrong!")
			res.redirect("/jobs");
		}else{
			req.flash("success", "Details edited successfully!");
			res.redirect("/jobs/"+ req.params.id);
		}
	});
//redirect show page
});

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkJobOwnership, function(req, res){
	Job.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/jobs");
		}else{
			req.flash("success", "Details  deleted successfully");
			res.redirect("/jobs");
		}
	})
});




module.exports = router;