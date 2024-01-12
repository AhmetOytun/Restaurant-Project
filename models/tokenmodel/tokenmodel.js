const mongoose = require("mongoose");
const schema=mongoose.Schema;

const tokenSchema = new schema({
    userID:String,
    Token:String,
    isUsed:Boolean
});

const Token = mongoose.model('token',tokenSchema);

module.exports=Token;