const mongoose = require("mongoose");
const schema=mongoose.Schema;

const userSchema = new schema({
    Username:String,
    Password:String,
    Name:String,
    Surname:String,
    Email:String,
    Location:String,
    Age:Number,
    Gender:String,
    ProfilePicture:String,
    FavouriteRestaurants:[]
});

const User = mongoose.model('user',userSchema);


module.exports=User;