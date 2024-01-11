const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path")
const auth = require("../../auth/auth");
const user = require("../../usermodels/usermodel");
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "images")
    },
    filename:(req,file,cb)=>{
        console.log(file)
        cb(null,Date.now()+path.extname(file.originalname))
    }
});

const upload = multer({storage:storage})

router.post("/image",auth,upload.single("image"),async (req,res)=>{
    const userInfo = await user.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    userInfo.ProfilePicture = `./images/${req.file.filename}`
    await userInfo.save();

    res.send(userInfo.ProfilePicture);
});

module.exports = router;