<!-- @@@@@@@@@@@@@@@@ BLOG APP @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-->

<!-- ############ MODLES ########################## -->
Schema of Blogs,
Schema of Events,
Schema of Exams,
Schema of Jobs,
Schema of Project,
Schema of user

<!-- ############# ROUTES ########################## -->
<!-- index.js -->
"/" : 
    render to index.ejs; <!-- Wellcome page -->

"/imgInfo":
    render to imageInfo.ejs; <!-- Detailed info of how to add image link inorder to give image while writing new post -->

"/register":
    render to register page
    <!-- for non-admin user -->
    if (username is unique && email is unique && password is entered && usercode is verified) then
        new user is registered and details are saved in db.
        redirect to '/blogs'
    else
        redirect back to register page with error message
    <!-- for admin user -->
    if (username is unique && email is unique && password is entered && usercode is verified && admincode is verified) then
        new adminuser is registered and details are saved in db.
        redirect to '/blogs'
    else
        redirect back to register page with error message

"/login":
    render to login form
    if(usernamr and password matches the database details) then
        redirect to '/blogs'
    else
        redirect back

"/forgot":
    render to forget password form
    enter the email whose password is forgot
    if(account with that email exist) then
        mail is sent with reset password route to enter new password which redirects to '/blogs' and token which expires after an hour
    else
        redirect back with error message

"/admin":
    which is protected by a lock which unlocks only is user is admin
    render to admin.ejs
    admin can view all user and also remove or delete any other user

<!-- The below code is same for all other section just with different routes  -->
"/blogs":
    render to allBlogs.ejs
    shows all posts in the database for a particular section
    end user can only view all posts

"/blogs/new":
    if (user is logged in) then
        render to new.ejs
        user can write a new blogs with entering the asked details
    else
        redirect back to '/blogs'

"/blogs/:id":
    render to show.ejs
    end user can only view more detailed info about a particular post
    if(user.username matches authorOfPost.username) then
        unlock and show routes as well as buttons to edit and delete that post
    else
        can only view that post

"/blogs/:id/edit":
    if(user is logged in and is author of that post) then
        render to edit page with the exisiting data of that post
        user can change details and submit
        then the details of that post is updated even in db and reflected the same in all routes
    else
        redirect back to previous route

"/blogs/:id/delete":
    if(user is logged in and is author of that post) then
        the post is deleted and redirect back to '/blogs'
    else
        redirect back to previous route

<!-- Admin activity -->
If the user is admin, he/she can edit/delete any post if its irrelevent

<!-- ################ MIDDLEWARE ################## -->
"checkOwnership":
    if(user is logged in and authorOfPost.username euals to user.username) then
        proceed to next route
    else
        redirect back to previous route

"isLoggedIn":
    if(isAuthenticated) then
        proceed to next route
    else
        no other activities is allowed
    
"isAdmin":
    if(isAdmin equals to true) then
        proceed to next route
    else
        redirect back

<!-- @@@@@@@@@@@@@@@@@@@@ INTERACTION APP @@@@@@@@@@@@@@@@@ -->

<!-- ############ MODLES ########################## -->
Schema of User,
Schema of Students,

<!-- ############ ROUTES ########################### -->

"/":
    render to index.ejs
    button to render to admin and proctor page

"/register", "/login", "/forgot":
    is same as blog app
    only is usercode is given he/she is registered as proctor
    and if usercode and admincode is given the he/she is registered as admin

"/user":
    render to allUser/index.ejs
    if(isAdmin) then
        button to logout
        button to view all students
    else
        button to logout
        button to view all students
        button to add new student

"/user/:id/feeDone/:stud_id":
    route is protected only admin can access it
    admin can update the fee status of student with id=stud_id to paid

"/user/:id/feeUnDone/:stud_id":
    route is protected only admin can access it
    admin can update the fee status of student with id=stud_id to pending

"/user/:id":
    this route is protected and only admin can visit
    proctor can only view all the students thats enrolled by him/her

"/user/:id/students/new":
    route is protected and only proctor can add and fee status is pending by default
    render to student details form
    after submiting, details is saved in db under that proctor

"/user/:id/students/edit/:stud_id":
    route is protected and only proctor can edit
    proctor can edit every details of a student with id=stud_id except changing the proctor and fee status
    render or edit form with existing data
    after submiting, updated details is saved in db the reflected the same

"/user/:id/students/delete/:stud_id":
    route is protected and only proctor can delete
    proctor can delete any of a student with id=stud_id
    and redirect to '/user'

<!-- ############### MIDDLEWARE ################### -->
all middleware is same as BLOG SECTION


