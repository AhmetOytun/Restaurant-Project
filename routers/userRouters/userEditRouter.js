const express = require("express");
const router = express.Router();
const user = require("../../usermodels/usermodel");
const auth = require("../../auth/auth");
const bcrypt = require("bcrypt");

router.post("/name",auth,async (req,res)=>{// post request for changing the Name
    if(req.body.newName=="" || req.body.newName===undefined){
        res.send("newName cant be empty.");
    }else{
        const editUserName = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserName.Name = req.body.newName;

        await editUserName.save()
        .then(res=>console.log("User Name has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserName);
    }
});

router.post("/surname",auth,async (req,res)=>{// post request for changing the Surname
    if(req.body.newSurname=="" || req.body.newSurname===undefined){
        res.send("newSurname cant be empty.");
    }else{
        const editUserSurname = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserSurname.Surname = req.body.newSurname;

        await editUserSurname.save()
        .then(res=>console.log("User Surname has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserSurname );
    }
});

router.post("/email",auth,async (req,res)=>{// post request for changing the Email
    if(req.body.newEmail=="" || req.body.newEmail===undefined){
        res.send("newEmail cant be empty.");
    }else{
        const editUserEmail = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserEmail.Email = req.body.newEmail;

        await editUserEmail.save()
        .then(res=>console.log("User Email has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserEmail );
    }
});

router.post("/location",auth,async (req,res)=>{// post request for changing the location
    if(req.body.newLocation=="" || req.body.newLocation===undefined){
        res.send("newLocation cant be empty.");
    }else{
        const editUserLocation = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserLocation.Location = req.body.newLocation;

        await editUserLocation.save()
        .then(res=>console.log("User Location has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserLocation);
    }
});

router.post("/age",auth,async (req,res)=>{// post request for changing the Age
    if(req.body.newAge=="" || req.body.newAge===undefined){
        res.send("newAge cant be empty.");
    }else{
        const editUserAge = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserAge.Age = req.body.newAge;

        await editUserAge.save()
        .then(res=>console.log("User Age has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserAge);
    }
});

router.post("/gender",auth,async (req,res)=>{// post request for changing the Gender
    if(req.body.newGender=="" || req.body.newGender===undefined){
        res.send("newGender cant be empty.");
    }else{
        const editUserGender = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserGender.Gender = req.body.newGender;

        await editUserGender.save()
        .then(res=>console.log("User Gender has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserGender);
    }
});

router.post("/profilepicture",auth,async (req,res)=>{// post request for changing the ProfilePicture
    if(req.body.newProfilePicture=="" || req.body.newProfilePicture===undefined){
        res.send("newProfilePicture cant be empty.");
    }else{
        const editUserProfilePicture = await user.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editUserProfilePicture.ProfilePicture = req.body.newProfilePicture;

        await editUserProfilePicture.save()

        .then(res=>console.log("User ProfilePicture has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editUserProfilePicture);
    }
});

router.post("/password",auth,async (req,res)=>{// changes password
    if(req.body.newPassword=="" || req.body.newPassword===undefined){
        res.send("newPassword cant be empty.");
    }else{
        const changePassword = await user.findByIdAndUpdate(req.decodedToken._id)
    
        const isValid = bcrypt.compare(req.body.oldPassword,changePassword.Password);

        if(isValid){
            let newHashedPassword=await bcrypt.hash(req.body.newPassword,10);

            changePassword.Password = newHashedPassword;

            await changePassword.save();

            res.send("Password has been successfully changed");
        }else{
            res.status(401).send("Passwords should match");
        }
    }
});

module.exports = router;