var express = require("express");
var router  = express.Router();
var Blog = require("../modles/Blogs");
var middleware = require("../middleware");
var Project      = require("../modles/Project");

router.get("/", function(req, res){
	Project.find({}).sort({created: -1}).exec(function(err, allProject){
		if(err){
			console.log(err);
		}else{
			res.render("Project/index", {projects: allProject});
		}
	})
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("Project/new")
});

//create
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var title = req.body.title;
	var teamMem = req.body.teamMembers;
	var brnch = req.body.branch;
    var img1 = req.body.image1;
    var img2 = req.body.image2;
    var img3 = req.body.image3;
    var img4 = req.body.image4;
    var img5 = req.body.image5;
    var img6 = req.body.image6;
    var img7 = req.body.image7;
    var img8 = req.body.image8;
    var img9 = req.body.image9;
    var img10 = req.body.image10;
	var desc = req.sanitize(req.body.description);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newProject = {
		title: title, 
		teamMembers: teamMem,
		branch: brnch,
        image1: img1,
        image2: img2,
        image3: img3,
        image4: img4,
        image5: img5,
        image6: img6,
        image7: img7,
        image8: img8,
        image9: img9,
        image10: img10,
        description: desc, 
        author: author
    };
	//Create a new blog and save to db
	Project.create(newProject, function(err, newlyCreated){
		if(err){
            //console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
		}else{
			//redirect back to projects
			req.flash("success", "Project added successfully!");
			res.redirect("/projects");
		}
	});
});

//SHOWS MORE INFO ABOUT ONE BLOG
router.get("/:id", function(req, res){
	//find the blog with provided id
	Project.findById(req.params.id, function(err, foundProject){
		if(err || !foundProject){
			req.flash("error", "Project not found!");
			res.redirect("/projects");
		}else{
			//RENDER SHOW TEMPLATE WITH THAT BLOG
			res.render("Project/show", {project: foundProject});
		}
	});
});

//EDIT Event ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res){

	Project.findById(req.params.id, function(err, foundProject){
		if(err || !foundProject){
			req.flash("error", "Project not found");
			res.redirect("/projects");
		}else{
			res.render("Project/edit", {project: foundProject});	
		}
	});
});

//UPDATE BLOG ROUTE
router.put("/:id", middleware.checkProjectOwnership, function(req, res){
	req.body.project.description= req.sanitize(req.body.project.description);
//find and update the correct blog
	Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updateProject){
		if(err || !updateProject){
			//console.log(err);
			req.flash("error", "Something went wrong!")
			res.redirect("/projects");
		}else{
			req.flash("success", "Project edited successfully!");
			res.redirect("/projects/"+ req.params.id);
		}
	});
//redirect show page
});

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkProjectOwnership, function(req, res){
	Project.findByIdAndRemove(req.params.id, function(err){
		if(err){
            //console.log(err);
            req.flash("error", "Something went wrong");
			res.redirect("/projects");
		}else{
			req.flash("success", "Project  deleted successfully");
			res.redirect("/projects");
		}
	})
});




module.exports = router;