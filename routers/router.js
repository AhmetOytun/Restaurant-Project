const dotenv = require("dotenv");
dotenv.config({path:"./.env.development"});
const express = require("express");
const router = express.Router();
const userRouter = require("./userRouters/userRouter");
const ownerRouter = require("./ownerRouters/ownerRouter");
const restaurantRouter = require("./restaurantRouters/restaurantRouter");
const commentRouter = require("./commentRouters/commentRouter");

router.use("/user",userRouter);
router.use("/owner",ownerRouter);
router.use("/restaurant",restaurantRouter);
router.use("/comment",commentRouter);

module.exports=router;