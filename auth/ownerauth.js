const jwt = require("jsonwebtoken");
const owner = require("../usermodels/ownermodel");

module.exports = async function verify(req,res,next){// checking the header for the valid token
    const token = req.header("X-Auth-Token");

    if(!token){
        res.status(401).send("You dont have permission to access this page.");
    }else{
        try {
            decodedToken = jwt.verify(token,`${process.env.JWT_SECRET_STRING}`);
            req.decodedToken=decodedToken;

            const isOwner = await owner.findById(decodedToken);

            if(isOwner){
                next();
            }else{
                res.send("User is not an owner");
            }
        } catch (error) {
            res.status(401).send("Wrong token.");
        }
    }
}
