const mongoose = require("mongoose");
const schema=mongoose.Schema;

const menuSchema = new schema({
    RestaurantID:String,
    Categories:[{
            CategoryName:String,
            Items:[{
                itemName:String,
                itemPrice:Number
            }]
    }]
});

const Menu = mongoose.model('menu',menuSchema);

module.exports=Menu;