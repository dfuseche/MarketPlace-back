const mongoose = require("mongoose");
const Product = require("./product.controller")

const usuarioSchema = {
    fName: {type: String},
    lName: {type: String},
    email: {type: String},
    cedula: {type: String},
    telephone: {type: String},
    password: {type: String},
    address: {type: String},
    products: [
        Product.schema
    ]

}

const User =  mongoose.model("user", usuarioSchema);


module.exports = User;