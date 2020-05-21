var express	 		= require("express"),
app 				= express(),
bodyParser 			= require("body-parser"),
mongoose			= require("mongoose"),
methodOveride		= require("method-override"),
flash				= require("connect-flash"),
//User				= require("./modles/user"),
User				= require("./modles/user"),
Student				= require("./modles/student"),
async				= require("async"),
nodemailer			= require("nodemailer"),
crypto				= require("crypto"),
passport			= require("passport"),
LocalStrategy 		= require("passport-local");

//requireing routes
var indexRoutes			= require("./routes/index"),
userRoutes 	= require("./routes/user"),
studentRoutes	= require("./routes/student");

mongoose.connect("mongodb://localhost/msrit_clg_interaction");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

//PASSPORT CONFIGRATION
app.use(require("express-session")({
	secret: "MSRIT INTERACTION",
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
app.use("/user", userRoutes);
app.use("/user/:id/students", studentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
	console.log("COLLEGE INTERACTION Server has Started!!");
});
