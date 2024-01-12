const express = require("express");
const router = express.Router();
const restaurantMenuCategoryRouter = require("./restaurantMenuCategoryRouter");
const restaurantMenuEditRouter = require("./restaurantMenuEditRouter");
const restaurantMenuItemRouter = require("./restaurantMenuItemRouter");
const ownerauth = require("../../auth/ownerauth");
const owner = require("../../models/usermodels/ownermodel");
const menu = require("../../models/menumodel/menumodel");

router.use("/category",restaurantMenuCategoryRouter);
router.use("/item",restaurantMenuItemRouter);
router.use("/edit",restaurantMenuEditRouter);

router.get("/get",async (req,res)=>{
    const Menu = await menu.findOne({RestaurantID:req.body.RestaurantID})
    if(Menu==null){
        res.send("There is no such Restaurant with the given id.");
    }else{
        res.send(Menu.Categories);
    }
});

router.post("/create",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOne({RestaurantID:restaurantOwner.OwnedRestaurantID})

    console.log(isMenu);

    if(isMenu){
        res.send("Category already exists.");
    }else{
        const newMenu = new menu({
            RestaurantID:restaurantOwner.OwnedRestaurantID,
            Categories:[]
        })
    
        await newMenu.save();
    
        res.send(newMenu);
    }
});

router.delete("/delete",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOneAndDelete({RestaurantID:restaurantOwner.OwnedRestaurantID})

    if(isMenu){
        res.send(isMenu)
    }else{
        res.send("Menu doesn't exist");
    }
});

module.exports = router;