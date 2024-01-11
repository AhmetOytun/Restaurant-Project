const mongoose = require("mongoose");
const schema=mongoose.Schema;

const restaurantSchema = new schema({
    Name:String,
    PhoneNumber:Number,
    Location:String,
    PriceRange:String,
    Likes:Number,
    Dislikes:Number,
    RestaurantPictureURL:String,
    LikedBy:[{
        Username:String
    }],
    DislikedBy:[{
        Username:String
    }],
    Comments:[{
        CommenterUsername:String,
        CommenterName:String,
        CommenterSurname:String,
        Comment:String,
        Likes:Number,
        Dislikes:Number,
        LikedBy:[{
            Username:String
        }],
        DislikedBy:[{
            Username:String
        }]
    }]
});

const Restaurant = mongoose.model('restaurant',restaurantSchema);

module.exports=Restaurant;