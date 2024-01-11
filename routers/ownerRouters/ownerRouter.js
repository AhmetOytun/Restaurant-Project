const express = require("express");
const router = express.Router();
const ownerEditRouter = require("./ownerEditRouter");
const ownerUploadRouter = require("./ownerUploadRouter");
const ownerauth = require("../../auth/ownerauth");
const owner = require("../../usermodels/ownermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generator = require('generate-password');


router.use("/edit",ownerEditRouter);
router.use("/upload",ownerUploadRouter);

router.post("/register", async(req,res)=>{
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

router.post("/login", async(req,res)=>{
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

router.get("/info",ownerauth, async(req,res)=>{// get request to get all the info
    const ownerInfo = await owner.findById(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    res.send(ownerInfo);
});

router.post("/forgotpassword",ownerauth,async (req,res)=>{// sends mail for authantication // CHANGE IT'S BEHAVIOUR TO SEND A LINK TO THE MAIL
    const forgotPassword = await owner.findByIdAndUpdate(req.decodedToken._id);

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

router.delete("/delete",ownerauth,async (req,res)=>{// deletes user
    const deleteUser = await owner.findOneAndDelete(req.decodedToken._id);

    if(!deleteUser){
       res.status(404).send("User doesn't exist on database");
    }else{
        res.send(deleteUser);
    }
});

module.exports = router;