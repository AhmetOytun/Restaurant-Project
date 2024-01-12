const express = require("express");
const router = express.Router();
const owner = require("../../models/usermodels/ownermodel");
const menu = require("../../models/menumodel/menumodel");
const ownerauth = require("../../auth/ownerauth");

router.post("/add",ownerauth,async (req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOneAndUpdate({RestaurantID:restaurantOwner.OwnedRestaurantID})
    let categoryIndex = -1;
    let itemIndex = -1;

    if(!isMenu){
        res.send("Menu doesn't exist.");
    }else{
        isMenu.Categories.forEach((Category,index)=>{
            if(Category.CategoryName==req.body.CategoryName){
                alreadyExists=true;
                categoryIndex=index;
            }
        })
        isMenu.Categories[categoryIndex].Items.forEach((Item,index)=>{
            if(Item.itemName==req.body.ItemName){
                itemIndex=index;
            }
        });
    
        if(categoryIndex==-1){
            res.send("No such category");
        }else if(itemIndex!=-1){
            res.send("Item already exists.");
        }else{
            const newItem = {
                itemName:req.body.ItemName,
                itemPrice:req.body.ItemPrice
            }

            isMenu.Categories[categoryIndex].Items.push(newItem)

            await isMenu.save();

            res.send(isMenu);
        }
    }
});

router.delete("/remove",ownerauth,async(req,res)=>{
    const restaurantOwner = await owner.findById(req.decodedToken._id);
    const isMenu = await menu.findOneAndUpdate({RestaurantID:restaurantOwner.OwnedRestaurantID})
    let categoryIndex = -1;
    let itemIndex = -1;

    if(!isMenu){
        res.send("Menu doesn't exist.");
    }else{
        isMenu.Categories.forEach((Category,index)=>{
            if(Category.CategoryName==req.body.CategoryName){
                alreadyExists=true;
                categoryIndex=index;
            }
        })
        isMenu.Categories[categoryIndex].Items.forEach((Item,index)=>{
            if(Item.itemName==req.body.ItemName){
                itemIndex=index;
            }
        });
    
        if(categoryIndex==-1){
            res.send("No such category");
        }else if(itemIndex==-1){
            res.send("Item doesn't exist");
        }else{
            console.log(itemIndex);
            isMenu.Categories[categoryIndex].Items.splice(itemIndex,1);

            await isMenu.save();

            res.send(isMenu);
        }
    }
});

module.exports = router;