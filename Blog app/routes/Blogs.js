var express 	= require("express");
var router  	= express.Router();
var Blog 		= require("../modles/Blogs");
var middleware 	= require("../middleware");


router.get("/", function(req, res){
	Blog.find({}).sort({created: -1}).exec(function(err, allBlog){
		if(err){
			console.log(err);
		}else{
			res.render("Blogs/allBlogs", {blogs: allBlog});
		}
	})
});

//New route
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	res.render("Blogs/new")
});

//create
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to blogs array
	var title = req.body.title;
	var img = req.body.image;
	var desc = req.sanitize(req.body.description);
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newBlog = {title: title, image: img, description: desc, author: author};
	//Create a new blog and save to db
	Blog.create(newBlog, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to blogs
			req.flash("success", "Blog added successfully!");
			res.redirect("/blogs");
		}
	});
});

//SHOWS MORE INFO ABOUT ONE BLOG
router.get("/:id", function(req, res){
	//find the blog with provided id
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", "Blog not found!");
			res.redirect("/blogs");
		}else{
			//RENDER SHOW TEMPLATE WITH THAT BLOG
			res.render("Blogs/show", {blog: foundBlog});
		}
	});
});

//EDIT BLOG ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){

	Blog.findById(req.params.id, function(err, foundBlog){
		if(err || !foundBlog){
			req.flash("error", "Blogs not found");
			res.redirect("/blogs");
		}else{
			res.render("Blogs/edit", {blog: foundBlog});	
		}
	});
});

//UPDATE BLOG ROUTE
router.put("/:id", middleware.checkBlogOwnership, function(req, res){
	req.body.blog.description= req.sanitize(req.body.blog.description);
//find and update the correct blog
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong!")
			res.redirect("/blogs");
		}else{
			req.flash("success", "Blog edited successfully!");
			res.redirect("/blogs/"+ req.params.id);
		}
	});
//redirect show page
});

//DESTROY BLOG ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			req.flash("success", "Blog  deleted successfully");
			res.redirect("/blogs");
		}
	})
});




module.exports = router;