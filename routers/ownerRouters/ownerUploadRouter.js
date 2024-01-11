const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path")
const ownerauth = require("../../auth/ownerauth");
const owner = require("../../usermodels/ownermodel");
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

router.post("/image",ownerauth,upload.single("image"),async (req,res)=>{
    const ownerInfo = await owner.findByIdAndUpdate(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    ownerInfo.ProfilePicture = `./images/${req.file.filename}`
    await ownerInfo.save();

    res.send(ownerInfo.ProfilePicture);
});

module.exports = router;