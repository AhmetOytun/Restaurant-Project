const express = require("express");
const router = express.Router();
const restaurant = require("../../models/restaurantmodel/restaurantmodel");
const owner = require("../../models/usermodels/ownermodel");
const ownerauth = require("../../auth/ownerauth");
const restaurantEditRouter = require("./restaurantEditRouter");
const auth = require("../../auth/auth");
const restaurantUploadRouter = require("./restaurantUploadRouter");
const restaurantMenuRouter = require("./restaurantMenuRouter");

router.use("/edit",restaurantEditRouter);
router.use("/upload",restaurantUploadRouter);
router.use("/menu",restaurantMenuRouter);

router.post("/create",ownerauth,async (req,res)=>{
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

router.get("/restaurants",async (req,res)=>{// get request to get all of the restaurants infos
    const restaurantInfo = await restaurant.find({}).sort({"Likes":-1});

    restaurantInfo.forEach(element=>{
        element.Comments.sort((comment)=>(comment.Dislikes-comment.Likes));
        console.log(element);
    });


    res.send(restaurantInfo);
});

router.post("/addfavourite",auth,async(req,res)=>{
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


router.post("/removefavourite",auth,async(req,res)=>{
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

router.post("/like",auth,async (req,res)=>{
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

router.post("/dislike",auth,async (req,res)=>{
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

router.delete("/delete",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findByIdAndUpdate(req.decodedToken._id);
    const deleteRestaurant = await restaurant.findByIdAndDelete(restaurantOwner.OwnedRestaurantID)
    .then(restaurantOwner.OwnedRestaurantID="")

    await restaurantOwner.save();

    res.send(deleteRestaurant);
});

module.exports = router;