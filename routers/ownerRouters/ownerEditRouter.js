const express = require("express");
const router = express.Router();
const owner = require("../../models/usermodels/ownermodel");
const ownerauth = require("../../auth/ownerauth");
const bcrypt = require("bcrypt");

router.post("/name",ownerauth,async (req,res)=>{// post request for changing the Name
    if(req.body.newName=="" || req.body.newName===undefined){
        res.send("newName cant be empty.");
    }else{
        const editownerName = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerName.Name = req.body.newName;

        await editownerName.save()
        .then(res=>console.log("owner Name has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerName);
    }
});

router.post("/surname",ownerauth,async (req,res)=>{// post request for changing the Surname
    if(req.body.newSurname=="" || req.body.newSurname===undefined){
        res.send("newSurname cant be empty.");
    }else{
        const editownerSurname = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerSurname.Surname = req.body.newSurname;

        await editownerSurname.save()
        .then(res=>console.log("owner Surname has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerSurname );
    }
});

router.post("/email",ownerauth,async (req,res)=>{// post request for changing the Email
    if(req.body.newEmail=="" || req.body.newEmail===undefined){
        res.send("newEmail cant be empty.");
    }else{
        const editownerEmail = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerEmail.Email = req.body.newEmail;

        await editownerEmail.save()
        .then(res=>console.log("owner Email has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerEmail );
    }
});

router.post("/location",ownerauth,async (req,res)=>{// post request for changing the location
    if(req.body.newLocation=="" || req.body.newLocation===undefined){
        res.send("newLocation cant be empty.");
    }else{
        const editownerLocation = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerLocation.Location = req.body.newLocation;

        await editownerLocation.save()
        .then(res=>console.log("owner Location has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerLocation);
    }
});

router.post("/age",ownerauth,async (req,res)=>{// post request for changing the Age
    if(req.body.newAge=="" || req.body.newAge===undefined){
        res.send("newAge cant be empty.");
    }else{
        const editownerAge = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerAge.Age = req.body.newAge;

        await editownerAge.save()
        .then(res=>console.log("owner Age has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerAge);
    }
});

router.post("/gender",ownerauth,async (req,res)=>{// post request for changing the Gender
    if(req.body.newGender=="" || req.body.newGender===undefined){
        res.send("newGender cant be empty.");
    }else{
        const editownerGender = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerGender.Gender = req.body.newGender;

        await editownerGender.save()
        .then(res=>console.log("owner Gender has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerGender);
    }
});

router.post("/profilepicture",ownerauth,async (req,res)=>{// post request for changing the ProfilePicture
    if(req.body.newProfilePicture=="" || req.body.newProfilePicture===undefined){
        res.send("newProfilePicture cant be empty.");
    }else{
        const editownerProfilePicture = await owner.findByIdAndUpdate(req.decodedToken._id)
        .catch(err=>res.status(404).send(err));

        editownerProfilePicture.ProfilePicture = req.body.newProfilePicture;

        await editownerProfilePicture.save()

        .then(res=>console.log("owner ProfilePicture has been successfully changed."))
        .catch(err=>console.error(err));

        res.send(editownerProfilePicture);
    }
});

router.post("/password",ownerauth,async (req,res)=>{// changes password
    if(req.body.newPassword=="" || req.body.newPassword===undefined){
        res.send("newPassword cant be empty.");
    }else{
        const changePassword = await owner.findByIdAndUpdate(req.decodedToken._id)
        const isValid = await bcrypt.compare(req.body.oldPassword,changePassword.Password);

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