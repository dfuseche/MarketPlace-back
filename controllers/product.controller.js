const mongoose = require("mongoose");

const productSchema = {
    name: {type: String},
    price: {type: Number},
    description: {type: String},
    image: {type: String},
    category: {type: String}

}

const Product =  mongoose.model("product", productSchema);


module.exports = Product;