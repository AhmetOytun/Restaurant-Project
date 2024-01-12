const express = require("express");
const router = express.Router();
const user = require("../../models/usermodels/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../auth/auth");
const restaurant = require("../../models/restaurantmodel/restaurantmodel");
const userEditRouter = require("./userEditRouter");
const nodemailer = require("nodemailer");
const userUploadRouter = require("./userUploadRouter");
const token = require("../../models/tokenmodel/tokenmodel");
const crypto = require("crypto");

router.use("/edit",userEditRouter);
router.use("/upload",userUploadRouter);

router.post("/register",async (req,res)=>{
    const userRegister = await user.findOne({Username:req.body.Username});

    if(userRegister){// if user already exists
        res.status(409).send("User already exists in database.");
    }else{
        let hashedPassword = await bcrypt.hash(req.body.Password,10);

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

router.get("/info",auth,async (req,res)=>{// get request to get all the info
    const userInfo = await user.findById(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    res.send(userInfo);
});

router.post("/forgotpassword",async (req,res)=>{// sends mail for authantication // CHANGE IT'S BEHAVIOUR TO SEND A LINK TO THE MAIL

    const User = await user.findOne({Username:req.body.username});

    if(User){
        const TOKEN = await token.findOne({userID:User._id});

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_MAIL,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        if(TOKEN){
            const newnewToken = crypto.randomBytes(32).toString("hex");
            TOKEN.Token = newnewToken;
            TOKEN.isUsed = false;
            await TOKEN.save();

            const newLink = `http://localhost:${process.env.SERVER_PORT}/user/forgotpassword/${User._id}/${newnewToken}`

            const mailOptions = {
                from: process.env.GMAIL_MAIL,
                to: User.Email,
                subject: 'ForgotPassword',
                text: `Link for changing your password: ${newLink}`
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });

            //make a new token and change it with the old one.

        }else{
            //make a new token
            const newToken = new token({
                userID: User._id,
                Token: crypto.randomBytes(32).toString("hex"),
                isUsed: false
            });

            newToken.save();

            const newLink = `http://localhost:${process.env.SERVER_PORT}/user/forgotpassword/${User._id}/${newToken.Token}`

            const mailOptions = {
                from: process.env.GMAIL_MAIL,
                to: User.Email,
                subject: 'ForgotPassword',
                text: `Link for changing your password: ${newLink}`
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
        }

        res.send("password change link has been sent to your mail.");
    }else{
        res.send("User doesn't exist.");
    }
});

router.post("/forgotpassword/:userId/:Token",async (req,res)=>{// sends mail for authantication // CHANGE IT'S BEHAVIOUR TO SEND A LINK TO THE MAIL
    const existingtoken = await token.findOne({Token:req.params.Token,userID:req.params.userId});
    
    if(!existingtoken.isUsed){
        existingtoken.isUsed = true;

        const changepassword = await user.findById(req.params.userId);

        let hashedPassword=await bcrypt.hash(req.body.newPassword,10);

        changepassword.Password = hashedPassword;

        changepassword.save();
        existingtoken.save();

        res.send("password has been successfully changed.");
    }else{
        res.send("link is invalid or expired.");
    }
});

router.delete("/delete",auth,async (req,res)=>{// deletes user
    const deleteUser = await user.findOneAndDelete(req.decodedToken._id);

    if(!deleteUser){
       res.status(404).send("User doesn't exist on database");
    }else{
        res.send(deleteUser);
    }
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

module.exports = router;