var express = require("express");
var router  = express.Router({mergeParams: true});
var User    = require("../modles/user"),
Student     = require("../modles/student"),
middleware  = require("../middleware");

//new student route
router.get("/new", middleware.isLoggedIn,function(req, res){
	//find user by id
	User.findById(req.params.id, function(err, user){
		if(err || !user){
            req.flash("error", "Something went wrong or user not found!");
            //console.log(err);
            res.redirect("back");
		}else{
			res.render("student/new", {user: user});
		}
	})
});

//student create
router.post("/", middleware.isNotAdmin,function(req, res){
	//lookup user using ID
	User.findById(req.params.id, function(err, user){
		if(err || !user){
			req.flash("error", "User not found");
			redirect("/user")
		}else{
			//Create new student
			Student.create(req.body.student, function(err, student){
				if(err){
					req.flash("error", "Something went wrong!");
                    //console.log(err);
                    res.redirect("back");
				}else{
                    //add username and id to student
					student.proctor.id = req.user._id;
                    student.proctor.username = req.user.username;
                    student.firstName = req.body.student.firstName;
                    student.noCaps  = req.body.student.firstName.toLowerCase();
                    student.lastName = req.body.student.lastName;
                    student.fatherName = req.body.student.fatherName;
                    student.motherName = req.body.student.motherName;
                    student.yearOfJoining = req.body.student.yearOfJoining;
					student.save();
					req.flash("success", "Successfully added studdent!");
					//redirect user show page
					res.redirect("/user");
				}
			});
		}
	});
});

//Edit students
router.get("/edit/:stud_id", middleware.checkUserOwnership,function(req, res){
    Student.findById(req.params.stud_id, function(err, foundStudent){
        if(err || !foundStudent){
            //console.log(err);
            req.flash("error", "Student not found!");
            res.redirect("back");
        }else{
            res.render("student/edit", {foundStudent: foundStudent});
        }
    });
});

//update student
router.put("/edit/:stud_id", middleware.checkStudentOwnership,function(req, res){
    Student.findByIdAndUpdate(req.params.stud_id, {
        firstName: req.body.student.firstName,
        noCaps: req.body.student.firstName.toLowerCase(),
        lastName: req.body.student.lastName,
        fatherName: req.body.student.fatherName,
        motherName: req.body.student.motherName,
        yearOfJoining: req.body.student.yearOfJoining

    }, function(err, student){
        if(err || !student){
            //console.log(err);
            req.flash("error", "Student not found!");
            res.redirect("back");
        }else{
            req.flash("success", "Editted Successfully!");
            res.redirect("/user/"+req.user._id);
        }
    })
});

//delete student
router.delete("/delete/:stud_id", middleware.checkStudentOwnership,function(req, res){
    Student.findByIdAndRemove(req.params.stud_id, function(err, foundStudent){
        if(err || !foundStudent){
            //console.log(err);
            req.flash("error", "Student not found!");
            res.redirect("back");
        }else{
            req.flash("success", "Student deleted successfully!");
            res.redirect("/user/"+req.user._id);
        }
    })
})

module.exports = router;