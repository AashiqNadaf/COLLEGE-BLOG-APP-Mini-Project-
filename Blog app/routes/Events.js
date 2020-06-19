var express 	= require("express");
var router  	= express.Router();
var Blog 		= require("../modles/Blogs");
var middleware 	= require("../middleware");
var Event       = require("../modles/Events");

router.get("/", function(req, res){
	Event.find({}).sort({created: -1}).exec(function(err, allEvents){
		if(err){
			console.log(err);
		}else{
			res.render("Event/index", {events: allEvents});
		}
	})
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("Event/new")
});

//create
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var title = req.body.title;
	var dt   = req.body.date;
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
	var newEvent = {
		title: title,
		date: dt, 
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
	Event.create(newEvent, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to blogs
			req.flash("success", "Event added successfully!");
			res.redirect("/events");
		}
	});
});

//SHOWS MORE INFO ABOUT ONE BLOG
router.get("/:id", function(req, res){
	//find the blog with provided id
	Event.findById(req.params.id, function(err, foundEvent){
		if(err || !foundEvent){
			req.flash("error", "Event not found!");
			res.redirect("/events");
		}else{
			//RENDER SHOW TEMPLATE WITH THAT BLOG
			res.render("Event/show", {event: foundEvent});
		}
	});
});

//EDIT Event ROUTE
router.get("/:id/edit", middleware.checkEventOwnership, function(req, res){

	Event.findById(req.params.id, function(err, foundEvent){
		if(err || !foundEvent){
			req.flash("error", "Event not found");
			res.redirect("/events");
		}else{
			res.render("Event/edit", {event: foundEvent});	
		}
	});
});

//UPDATE BLOG ROUTE
router.put("/:id", middleware.checkEventOwnership, function(req, res){
	req.body.event.description= req.sanitize(req.body.event.description);
//find and update the correct blog
	Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updateEvent){
		if(err || !updateEvent){
			//console.log(err);
			req.flash("error", "Something went wrong!")
			res.redirect("/events");
		}else{
			req.flash("success", "Event edited successfully!");
			res.redirect("/events/"+ req.params.id);
		}
	});
//redirect show page
});

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkEventOwnership, function(req, res){
	Event.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/events");
		}else{
			req.flash("success", "Event  deleted successfully");
			res.redirect("/events");
		}
	})
});




module.exports = router;