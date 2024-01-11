const express = require("express");
const router = express.Router();
const auth = require("../../auth/auth");

router.post("/create",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const comment = {
        CommenterUsername:commenter.Username,
        CommenterName:commenter.Name,
        CommenterSurname:commenter.Surname,
        Comment:req.body.Comment,
        Likes:0,
        Dislikes:0
    };

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        commentingRestaurant.Comments.push(comment);

        await commentingRestaurant.save();

        res.send(commentingRestaurant);
    }else{
        res.send("You have already commented for this restaurant.");
    }
});

router.delete("/delete",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        res.send("You haven't commented for this restaurant.");
    }else{
        commentingRestaurant.Comments.splice(searchIndex,1);

        await commentingRestaurant.save();

        res.send("Comment has been deleted.");
    }
});

router.post("/edit",auth,async (req,res)=>{
    const commentingRestaurant =  await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const commenter = await user.findById(req.decodedToken);

    const searchIndex = commentingRestaurant.Comments.findIndex((comments)=>comments.CommenterUsername==commenter.Username);

    if(searchIndex==-1){
        res.send("You haven't commented for this restaurant.");
    }else{
        commentingRestaurant.Comments[searchIndex].Comment = req.body.newComment;

        await commentingRestaurant.save();

        res.send("Comment has been successfully edited.");
    }
});

router.post("/like",auth,async (req,res)=>{
    const commenter = await user.findByIdAndUpdate(req.decodedToken._id);
    const commentedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID).sort({"Likes":-1});
    const indexOfComment = commentedRestaurant.Comments.findIndex((comment)=>comment._id==req.body.CommentID);

    const isLikedByUser = commentedRestaurant.Comments[indexOfComment].LikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);
    const isDislikedByUser = commentedRestaurant.Comments[indexOfComment].DislikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);


    if(isLikedByUser==-1){
        const comment = commentedRestaurant.Comments[indexOfComment].Likes ++;
        commentedRestaurant.Comments[indexOfComment].LikedBy.push({Username:commenter.Username});

        if(isDislikedByUser==-1){
            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }else{
            const comment = commentedRestaurant.Comments[indexOfComment].Dislikes --;
            commentedRestaurant.Comments[indexOfComment].DislikedBy.splice(isDislikedByUser,1);

            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }
    }else{
        res.send("User has already liked this comment.");
    }
});

router.post("/dislike",auth,async (req,res)=>{
    const commenter = await user.findByIdAndUpdate(req.decodedToken._id);
    const commentedRestaurant = await restaurant.findByIdAndUpdate(req.body.RestaurantID);
    const indexOfComment = commentedRestaurant.Comments.findIndex((comment)=>comment._id==req.body.CommentID);;

    const isLikedByUser = commentedRestaurant.Comments[indexOfComment].LikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);
    const isDislikedByUser = commentedRestaurant.Comments[indexOfComment].DislikedBy.findIndex((usernames)=>usernames.Username==commenter.Username);


    if(isDislikedByUser==-1){
        const comment = commentedRestaurant.Comments[indexOfComment].Dislikes ++;
        commentedRestaurant.Comments[indexOfComment].DislikedBy.push({Username:commenter.Username});

        if(isLikedByUser==-1){
            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }else{
            const comment = commentedRestaurant.Comments[indexOfComment].Likes --;
            commentedRestaurant.Comments[indexOfComment].LikedBy.splice(isLikedByUser,1);

            commentedRestaurant.save();

            res.send(commentedRestaurant.Comments[indexOfComment]);
        }
    }else{
        res.send("User has already been liked this comment.");
    }
});

module.exports = router;
