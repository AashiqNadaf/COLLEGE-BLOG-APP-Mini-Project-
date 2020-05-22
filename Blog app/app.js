var express	 		= require("express"),
app 				= express(),
bodyParser 			= require("body-parser"),
mongoose			= require("mongoose"),
expressSanitizer 	= require("express-sanitizer"),
Blog				= require("./modles/Blogs"),
Event				= require("./modles/Events"),
methodOveride		= require("method-override"),
flash				= require("connect-flash"),
User				= require("./modles/user"),
async				= require("async"),
nodemailer			= require("nodemailer"),
crypto				= require("crypto"),
passport			= require("passport"),
LocalStrategy 		= require("passport-local");

//requireing routes
var BlogRoutes 	= require("./routes/Blogs"),
indexRoutes			= require("./routes/index"),
eventRoutes			= require("./routes/Events"),
projectRoutes			= require("./routes/Project"),
examRoutes			= require("./routes/Exams"),
jobRoutes			= require("./routes/Jobs");

mongoose.connect("mongodb://localhost/msrit_clg_blog");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(flash());

//PASSPORT CONFIGRATION
app.use(require("express-session")({
	secret: "Mini project",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/blogs", BlogRoutes);
app.use("/events", eventRoutes);
app.use("/projects", projectRoutes);
app.use("/exams", examRoutes);
app.use("/jobs", jobRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
	console.log("COLLEGE BLOG Server has Started!!");
});
