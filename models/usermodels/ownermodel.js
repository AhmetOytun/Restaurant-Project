const mongoose = require("mongoose");
const schema=mongoose.Schema;

const ownerSchema = new schema({
    Username:String,
    Password:String,
    Name:String,
    Surname:String,
    Email:String,
    Location:String,
    Age:String,
    Gender:String,
    ProfilePicture:String,
    OwnedRestaurantID:String
});

const Owner = mongoose.model('owner',ownerSchema);

module.exports=Owner;