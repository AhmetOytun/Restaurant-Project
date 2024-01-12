const express = require("express");
const router = express.Router();
const owner = require("../../models/usermodels/ownermodel");
const menu = require("../../models/menumodel/menumodel");
const ownerauth = require("../../auth/ownerauth");

router.post("/add",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOne({RestaurantID:restaurantOwner.OwnedRestaurantID})
    let alreadyExists = false;

    if(!isMenu){
        res.send("Menu doesn't exist.");
    }else{
        isMenu.Categories.forEach(Category=>{
            if(Category.CategoryName==req.body.CategoryName){
                alreadyExists=true
            }
        })
    
        if(alreadyExists){
            res.send("Category Already Exists.");
        }else{
            const newCategory = {
                CategoryName:req.body.CategoryName,
                Items:[]
            }

            isMenu.Categories.push(newCategory);

            isMenu.save();

            res.send(isMenu);
        }
    }
});

router.delete("/remove",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOneAndUpdate({RestaurantID:restaurantOwner.OwnedRestaurantID})
    let categoryIndex = -1;

    if(!isMenu){
        res.send("Menu doesn't exist.");
    }else{
        isMenu.Categories.forEach((Category,index)=>{
            if(Category.CategoryName==req.body.CategoryName){
                categoryIndex=index;
            }
        })
    
        if(categoryIndex!=-1){
            isMenu.Categories.splice(categoryIndex,1);
            await isMenu.save();

            res.send(isMenu);
        }else{
            res.send("Category doesn't exist.");
        }
    }
});

module.exports = router;