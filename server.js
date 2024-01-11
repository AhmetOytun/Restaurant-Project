const dotenv = require("dotenv");
dotenv.config({path:"./.env.development"});

const express = require("express");
const app = express();
const db = require("./db/db");
const router = require("./routers/router");
const bodyParser = require("express").json;

app.use("/images",express.static("./images"))

app.use(bodyParser());// getting requests as json

app.listen(process.env.SERVER_PORT,()=>{// starting server
    console.log(`Server started at port:${process.env.SERVER_PORT}`);
})

db // mongodb connection
.then(res=>console.log("Successfully connected to mongodb"))
.catch(err=>console.error(err));

app.use(router);// routing
