var express 	= require("express");
var router  	= express.Router();
var Exam 		= require("../modles/Exams");
var middleware 	= require("../middleware");

router.get("/", function(req, res){
	Exam.find({}).sort({created: -1}).exec(function(err, allExam){
		if(err){
			console.log(err);
		}else{
			res.render("Exams/index", {exams: allExam});
		}
	})
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("Exams/new")
});

//create
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var toe = req.body.typeOfExam;
	var sb1 = req.body.sub1;
	var dt1 = req.body.date1;
    var sb2 = req.body.sub2;
    var dt2 = req.body.date2;
    var sb3 = req.body.sub3;
    var dt3 = req.body.date3;
    var sb4 = req.body.sub4;
    var dt4 = req.body.date4;
    var sb5 = req.body.sub5;
    var dt5 = req.body.date5;
    var sb6 = req.body.sub6;
    var dt6 = req.body.date6;
    var sb7 = req.body.sub7;
    var dt7 = req.body.date7;
    var sb8 = req.body.sub8;
    var dt8 = req.body.date8;
    var sb9 = req.body.sub9;
    var dt9 = req.body.date9;
    var sb10 = req.body.sub10;
    var dt10 = req.body.date10;
    var sb11 = req.body.sub11;
    var dt11 = req.body.date11;
    var sb12 = req.body.sub12;
    var dt12 = req.body.date12;
    var sm   = req.body.sem;
    var brnch= req.body.branch;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newExam = {
		typeOfExam: toe, 
		sem: sm,
		branch: brnch,
        sub1: sb1,
        date1: dt1,
        sub2: sb2,
        date2: dt2,
        sub3: sb3,
        date3: dt3,
        sub4: sb4,
        date4: dt4,
        sub5: sb5,
        date5: dt5,
        sub6: sb6,
        date6: dt6,
        sub7: sb7,
        date7: dt7,
        sub8: sb8,
        date8: dt8,
        sub9: sb9,
        date9: dt9,
        sub10: sb10,
        date10: dt10,
        sub11: sb11,
        date11: dt11,
        sub12: sb12,
        date12: dt12,
        author: author
    };
	//Create a new blog and save to db
	Exam.create(newExam, function(err, newlyCreated){
		if(err){
            //console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
		}else{
			//redirect back to projects
			req.flash("success", "Exam added successfully!");
			res.redirect("/exams");
		}
	});
});

//SHOWS MORE INFO ABOUT ONE BLOG
router.get("/:id", function(req, res){
	//find the blog with provided id
	Exam.findById(req.params.id, function(err, foundExam){
		if(err || !foundExam){
			req.flash("error", "Exam not found!");
			res.redirect("/exams");
		}else{
			//RENDER SHOW TEMPLATE WITH THAT BLOG
			res.render("Exams/show", {exam: foundExam});
		}
	});
});

//EDIT Event ROUTE
router.get("/:id/edit", middleware.checkExamOwnership, function(req, res){

	Exam.findById(req.params.id, function(err, foundExam){
		if(err || !foundExam){
			req.flash("error", "Exam not found");
			res.redirect("/exams");
		}else{
			res.render("Exams/edit", {exam: foundExam});	
		}
	});
});

//UPDATE BLOG ROUTE
router.put("/:id", middleware.checkExamOwnership, function(req, res){
//find and update the correct blog
	Exam.findByIdAndUpdate(req.params.id, req.body.exam, function(err, updateExam){
		if(err || !updateExam){
			//console.log(err);
			req.flash("error", "Something went wrong!")
			res.redirect("/exams");
		}else{
			req.flash("success", "Exam edited successfully!");
			res.redirect("/exams/"+ req.params.id);
		}
	});
//redirect show page
});

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkExamOwnership, function(req, res){
	Exam.findByIdAndRemove(req.params.id, function(err){
		if(err){
            //console.log(err);
            req.flash("error", "Something went wrong");
			res.redirect("/exams");
		}else{
			req.flash("success", "Exam  deleted successfully");
			res.redirect("/exams");
		}
	})
});




module.exports = router;