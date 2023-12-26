const dotenv = require("dotenv");
dotenv.config({path:"./.env.development"});
const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const ownerauth = require("../auth/ownerauth");
const user = require("../usermodels/usermodel");
const owner = require("../usermodels/ownermodel");
const restaurant = require("../restaurantmodel/restaurantmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generator = require('generate-password');

router.post("/register",async (req,res)=>{
    const userRegister = await user.findOne({Username:req.body.Username});

    if(userRegister){// if user already exists
        res.status(409).send("User already exists in database.");
    }else{
        let hashedPassword=await bcrypt.hash(req.body.Password,10);

        const newUser = new user({// create new user
            "Username":req.body.Username,
            "Password":hashedPassword,
            "Name":req.body.Name,
            "Surname":req.body.Surname,
            "Email":req.body.Email,
            "Location":req.body.Location,
            "Age":req.body.Age,
            "Gender":req.body.Gender,
            "ProfilePicture":req.body.ProfilePicture
        });

        await newUser.save()// save new user to the database
        .then(res=>console.log("User has been successfully saved."))
        .catch(err=>console.error(err));

        res.send("Successfully registered.");
    }
});

router.post("/login", async (req,res)=>{
    const userLogin = await user.findOne({Username: req.body.Username});

    const isValid = await bcrypt.compare(req.body.Password,userLogin.Password)

    const token = jwt.sign({_id:userLogin._id}, `${process.env.JWT_SECRET_STRING}`, {
        expiresIn: '1h' // expires in 1 hour
         });
        

    if(!userLogin){// actually user doesn't exist in database
        res.status(404).send("Username or password is not correct");
    }else if(!isValid){
        res.send("Username or password is not correct");// actually password is not correct
    }else{
        res.header("X-Auth-Token", token).send("Successfully logged in");
    }
});

router.get("/userinfo",auth,async (req,res)=>{// get request to get all the info
    const userInfo = await user.findById(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    res.send(userInfo);
});

router.post("/edituserinfo/Name",auth,async (req,res)=>{// post request for changing the Name
    const editUserName = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserName.Name = req.body.newName;

    await editUserName.save()
    .then(res=>console.log("User Name has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserName);
});

router.post("/edituserinfo/Surname",auth,async (req,res)=>{// post request for changing the Surname
    const editUserSurname = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserSurname.Surname = req.body.newSurname;

    await editUserSurname.save()
    .then(res=>console.log("User Surname has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserSurname );
});

router.post("/edituserinfo/Email",auth,async (req,res)=>{// post request for changing the Email
    const editUserEmail = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserEmail.Email = req.body.newEmail;

    await editUserEmail.save()
    .then(res=>console.log("User Email has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserEmail );
});

router.post("/edituserinfo/Location",auth,async (req,res)=>{// post request for changing the location
    const editUserLocation = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserLocation.Location = req.body.newLocation;

    await editUserName.save()
    .then(res=>console.log("User Location has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserLocation);
});

router.post("/edituserinfo/Age",auth,async (req,res)=>{// post request for changing the Age
    const editUserAge = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserAge.Age = req.body.newAge;

    await editUserAge.save()
    .then(res=>console.log("User Age has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserAge);
});

router.post("/edituserinfo/Gender",auth,async (req,res)=>{// post request for changing the Gender
    const editUserGender = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserGender.Gender = req.body.newGender;

    await editUserGender.save()
    .then(res=>console.log("User Gender has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserGender);
});

router.post("/edituserinfo/ProfilePicture",auth,async (req,res)=>{// post request for changing the ProfilePicture
    const editUserProfilePicture = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    editUserProfilePicture.ProfilePicture = req.body.ProfilePicture;

    await editUserProfilePicture.save()

    .then(res=>console.log("User ProfilePicture has been successfully changed."))
    .catch(err=>console.error(err));

    res.send(editUserProfilePicture);
});

router.post("/changepassword",auth,async (req,res)=>{// changes password
    const changePassword = await user.findByIdAndUpdate(req.decodedToken._id)
    if(!changePassword){
        changePassword = await owner.findByIdAndUpdate(req.decodedToken._id)
    }
    
    const isValid = await bcrypt.compare(req.body.Password,changePassword.Password);

    if(isValid){
        let newHashedPassword=await bcrypt.hash(req.body.newPassword,10);

        changePassword.Password = newHashedPassword;

        await changePassword.save();

        res.send("Password has been successfully changed");
    }else{
        res.status(401).send("Passwords should match");
    }
});

router.post("/forgotpassword",auth,async (req,res)=>{// sends mail for authantication
    const forgotPassword = await user.findByIdAndUpdate(req.decodedToken._id)

    if(!forgotPassword){
        forgotPassword = await owner.findByIdAndUpdate(req.decodedToken._id)
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_MAIL,
            pass: process.env.GMAIL_APP_PASSWORD
        }
    });

    const generatedPassword = generator.generate({
    length: 10,
    numbers: true
    });

    const mailOptions = {
        from: process.env.GMAIL_MAIL,
        to: forgotPassword.Email,
        subject: 'Password',
        text: `Your new password is ${generatedPassword}`
    };

    forgotPassword.Password = await bcrypt.hash(generatedPassword,10);

    await forgotPassword.save();

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.send("Mail has been successfully sent.");
});

router.delete("/deleteuser",auth,async (req,res)=>{// deletes user
    const deleteUser = await user.findOneAndDelete(req.decodedToken._id);

    if(!deleteUser){
       res.status(404).send("User doesn't exist on database");
    }else{
        res.send(deleteUser);
    }
});

router.post("/registerowner",async (req,res)=>{
    const restaurantOwner = await owner.findOne({Username:req.body.Username});

    if(restaurantOwner){
        res.send("Owner already exists.");
    }else{
        let hashedPassword=await bcrypt.hash(req.body.Password,10);

        const newOwner = new owner({
            "Username":req.body.Username,
            "Password":hashedPassword,
            "Name":req.body.Name,
            "Surname":req.body.Surname,
            "Email":req.body.Email,
            "Location":req.body.Location,
            "Age":req.body.Age,
            "Gender":req.body.Gender,
            "ProfilePicture":req.body.ProfilePicture,
            "OwnedRestaurantID":req.body.RestaurantID
        })
        
        await newOwner.save()
        .then(res=>console.log("Owner has been successfully saved."))
        .catch(err=>console.error(err));

        res.send("Owner successfully saved.");
    }
});

router.post("/loginowner", async (req,res)=>{
    const ownerLogin = await owner.findOne({Username: req.body.Username});

    const isValid = await bcrypt.compare(req.body.Password,ownerLogin.Password)

    const token = jwt.sign({_id:ownerLogin._id}, `${process.env.JWT_SECRET_STRING}`, {
        expiresIn: '1h' // expires in 1 hour
    });
        

    if(!ownerLogin){// actually user doesn't exist in database
        res.status(404).send("Username or password is not correct");
    }else if(!isValid){
        res.send("Username or password is not correct");// actually password is not correct
    }else{
        res.header("X-Auth-Token", token).send("Successfully logged in");
    }
});

router.post("/createrestaurant",ownerauth,async (req,res)=>{
    const newRestaurantOwner = await owner.findByIdAndUpdate(req.decodedToken._id);
    const existingRestaurant = await restaurant.findOne({Name:req.body.Name});

    if(existingRestaurant){
        res.send("Restaurant already exists.");
    }else{
        const newRestaurant = new restaurant({
            "Name":req.body.Name,
            "PhoneNumber":req.body.PhoneNumber,
            "Location":req.body.Location,
            "PriceRange":req.body.PriceRange,
            "Likes":0,
            "Dislikes":0,
            "Favourites":0
        });
    
        await newRestaurant.save();
    
        newRestaurantOwner.OwnedRestaurantID = newRestaurant._id;

        await newRestaurantOwner.save();
        
        res.send("Restaurant has been created.");
    }
});

router.post("/createcomment",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const comment = {
        CommenterUsername:commenter.Username,
        CommenterName:commenter.Name,
        CommenterSurname:commenter.Surname,
        Comment:req.body.Comment,
        Likes:0,
        Dislikes:0
    };

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        commentingRestaurant.Comments.push(comment);

        await commentingRestaurant.save();

        res.send(commentingRestaurant);
    }else{
        res.send("You have already commented for this restaurant.");
    }
});

router.delete("/deletecomment",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        res.send("You haven't commented for this restaurant.");
    }else{
        commentingRestaurant.Comments.splice(searchIndex,1);

        await commentingRestaurant.save();

        res.send("Comment has been deleted.");
    }
});

router.post("/editcomment",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        res.send("You haven't commented for this restaurant.");
    }else{
        commentingRestaurant.Comments[searchIndex].Comment = req.body.newComment;

        await commentingRestaurant.save();

        res.send("Comment has been successfully edited.");
    }
});

router.get("/getallrestaurants",async (req,res)=>{// get request to get all of the restaurants infos
    const restaurantInfo = await restaurant.find({}).sort({"Likes":-1});

    restaurantInfo.forEach(element=>{
        element.Comments.sort((comment)=>(comment.Dislikes-comment.Likes));
        console.log(element);
    });

    res.send(restaurantInfo);
});

router.get("/usermainpage",auth,async (req,res)=>{
    const User = await user.findById(req.decodedToken._id);
    const restaurantInfo = await restaurant.find({}).sort({"Likes":-1});

    restaurantInfo.sort((restaurant)=>-User.FavouriteRestaurants.includes(restaurant._id));

    restaurantInfo.forEach(element=>{
        element.Comments.sort((comment)=>(comment.Dislikes-comment.Likes));
        console.log(element);
    });

    res.send(restaurantInfo);
});

router.delete("/deleterestaurant",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findByIdAndUpdate(req.decodedToken._id);
    const deleteRestaurant = await restaurant.findByIdAndDelete(restaurantOwner.OwnedRestaurantID)
    .then(restaurantOwner.OwnedRestaurantID="")

    await restaurantOwner.save();

    res.send(deleteRestaurant);
});

router.post("/editrestaurantname",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.Name = req.body.newName;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.post("/editrestaurantphonenumber",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.PhoneNumber = req.body.newPhoneNumber;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.post("/editrestaurantlocation",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.Location = req.body.newLocation;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.post("/editrestaurantpricerange",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.PriceRange = req.body.newPriceRange;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.get("/ownerinfo",ownerauth,async (req,res)=>{// get request to get all the info
    const ownerInfo = await owner.findById(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    res.send(ownerInfo);
});

router.post("/likecomment",auth,async (req,res)=>{
    const commenter = await user.findByIdAndUpdate(req.decodedToken._id);
    const commentedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID).sort({"Likes":-1});
    const indexOfComment = commentedRestaurant.Comments.findIndex((comment)=>comment._id==req.body.CommentID);

    const isLikedByUser = commentedRestaurant.Comments[indexOfComment].LikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);
    const isDislikedByUser = commentedRestaurant.Comments[indexOfComment].DislikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);


    if(isLikedByUser==-1){
        const comment = commentedRestaurant.Comments[indexOfComment].Likes ++;
        commentedRestaurant.Comments[indexOfComment].LikedBy.push({Username:commenter.Username});

        if(isDislikedByUser==-1){
            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }else{
            const comment = commentedRestaurant.Comments[indexOfComment].Dislikes --;
            commentedRestaurant.Comments[indexOfComment].DislikedBy.splice(isDislikedByUser,1);

            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }
    }else{
        res.send("User has already liked this comment.");
    }
});

router.post("/dislikecomment",auth,async (req,res)=>{
    const commenter = await user.findByIdAndUpdate(req.decodedToken._id);
    const commentedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const indexOfComment = commentedRestaurant.Comments.findIndex((comment)=>comment._id==req.body.CommentID);;

    const isLikedByUser = commentedRestaurant.Comments[indexOfComment].LikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);
    const isDislikedByUser = commentedRestaurant.Comments[indexOfComment].DislikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);


    if(isDislikedByUser==-1){
        const comment = commentedRestaurant.Comments[indexOfComment].Dislikes ++;
        commentedRestaurant.Comments[indexOfComment].DislikedBy.push({Username:commenter.Username});

        if(isLikedByUser==-1){
            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }else{
            const comment = commentedRestaurant.Comments[indexOfComment].Likes --;
            commentedRestaurant.Comments[indexOfComment].LikedBy.splice(isLikedByUser,1);

            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }
    }else{
        res.send("User has already been liked this comment.");
    }
});

router.post("/likerestaurant",auth,async (req,res)=>{
    const rater = await user.findByIdAndUpdate(req.decodedToken._id);
    const ratedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const isLikedByUser = ratedRestaurant.LikedBy.findIndex((usernames)=>usernames.Username==rater.Username);
    const isDislikedByUser = ratedRestaurant.DislikedBy.findIndex((usernames)=>usernames.Username==rater.Username);

    if(isLikedByUser==-1){
        ratedRestaurant.LikedBy.push({Username:rater.Username});
        ratedRestaurant.Likes++;

        if(isDislikedByUser==-1){
            ratedRestaurant.save();

            res.send(ratedRestaurant.LikedBy);
        }else{
            ratedRestaurant.DislikedBy.splice(isDislikedByUser,1);
            ratedRestaurant.Dislikes--;

            ratedRestaurant.save();

            res.send(ratedRestaurant);
        }
    }else{
        res.send("User has already been liked this comment.");
    }
});

router.post("/addfavouriterestaurant",auth,async(req,res)=>{
    const favuser = await user.findByIdAndUpdate(decodedToken._id);
    const searchIndex = favuser.FavouriteRestaurants.findIndex((id)=>id==req.body.RestaurantID);

    if(searchIndex==-1){
        favuser.FavouriteRestaurants.push(req.body.RestaurantID);

        await favuser.save();

        res.send(favuser);
    }else{
        res.send("Already at favourites.");
    }
});

router.post("/removefavouriterestaurant",auth,async(req,res)=>{
    const favuser = await user.findByIdAndUpdate(decodedToken._id);
    const searchIndex = favuser.FavouriteRestaurants.findIndex((id)=>id==req.body.RestaurantID);

    if(searchIndex!=-1){
        favuser.FavouriteRestaurants.splice(searchIndex,1);

        await favuser.save();

        res.send(favuser);
    }else{
        res.send("User is not in favourites.");
    }
});


router.post("/dislikerestaurant",auth,async (req,res)=>{
    const rater = await user.findByIdAndUpdate(req.decodedToken._id);
    const ratedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const isLikedByUser = ratedRestaurant.LikedBy.findIndex((usernames)=>usernames.Username==rater.Username);
    const isDislikedByUser = ratedRestaurant.DislikedBy.findIndex((usernames)=>usernames.Username==rater.Username);

    if(isDislikedByUser==-1){
        ratedRestaurant.DislikedBy.push({Username:rater.Username});
        ratedRestaurant.Dislikes++;

        if(isLikedByUser==-1){
            ratedRestaurant.save();

            res.send(ratedRestaurant.DislikedBy);
        }else{
            ratedRestaurant.LikedBy.splice(isLikedByUser,1);
            ratedRestaurant.Likes--;

            ratedRestaurant.save();

            res.send(ratedRestaurant.DislikedBy);
        }
    }else{
        res.send("User has already been liked this comment.");
    }
});


router.get("/",(req,res)=>{
    res.send("Hello server!");
})


module.exports=router;