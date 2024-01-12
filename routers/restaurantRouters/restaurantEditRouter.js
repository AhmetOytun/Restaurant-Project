const express = require("express");
const router = express.Router();
const owner = require("../../models/usermodels/ownermodel");
const restaurant = require("../../models/restaurantmodel/restaurantmodel");
const ownerauth = require("../../auth/ownerauth");

router.post("/name",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.Name = req.body.newName;

    await editRestaurant.save();

    res.send(editRestaurant);
});


router.post("/phonenumber",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.PhoneNumber = req.body.newPhoneNumber;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.post("/location",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.Location = req.body.newLocation;

    await editRestaurant.save();

    res.send(editRestaurant);
});

router.post("/pricerange",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const editRestaurant = await restaurant.findByIdAndUpdate(restaurantOwner.OwnedRestaurantID);

    editRestaurant.PriceRange = req.body.newPriceRange;

    await editRestaurant.save();

    res.send(editRestaurant);
});

module.exports = router;