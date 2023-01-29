const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const usuarioRouter = require("./routes/usuarios");
const productRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json({limit:'1mb'}))
console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
//Routes
app.use("/api/usuarios", usuarioRouter);
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter)


app.listen(3000, ()=>{
    console.log("listening port 3000");
})





