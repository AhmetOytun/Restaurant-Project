const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path")
const ownerauth = require("../../auth/ownerauth");
const owner = require("../../usermodels/ownermodel");
const restaurant = require("../../restaurantmodel/restaurantmodel");
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
    const ownerInfo = await owner.findById(req.decodedToken._id)
    .catch(err=>res.status(404).send(err));

    const restaurantInfo = await restaurant.findByIdAndUpdate(ownerInfo.OwnedRestaurantID)
    .catch(err=>res.status(404).send(err));

    restaurantInfo.RestaurantPictureURL = `./images/${req.file.filename}`
    await restaurantInfo.save();

    res.send(ownerInfo.ProfilePicture);
});

module.exports = router;