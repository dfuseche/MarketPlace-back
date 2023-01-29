const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Product = require("../controllers/product.controller");
const Usuario = require("../controllers/usuario.controller");


router.get("/" ,function(req, res){
    Product.find({}, function(err, result){
        if(err){
            res.send(err);
        }else {
            console.log(result);
            res.send(result);
        }
    })
})

router.get("/detailProduct/:idProduct", function(req, res){
    console.log(req.params.idProduct.toString())
    Usuario.findOne({"products._id": req.params.idProduct.toString()}, function(err, result){
        if(err){
            res.send(err);
        }else {
            res.send(result)
        }
    })
})

router.get("/:idUser", function(req, res){
    Usuario.findById({_id: req.params.idUser}, function(err, result){
        if(err){
            res.send(err);
        }else {
            res.send(result.products);
        }
    })
})

router.get("/category/:nameCategory", function(req, res){
    Product.find({category: req.params.nameCategory}, function(err, products){
        if(err){
            res.send(err);
        }else {
            res.send(products);
        }
    })
})

router.post("/:idUsuario", function(req, res){
    const {err} = validateProduct(req.body);
    if(err){
        return res.status(400).send(error.details[0].message);
    } else{
        const {name, price, description, image, category} = req.body;
        console.log(name)
        const newProduct = new Product({
            name: name,
            price: price,
            description: description,
            image: image,
            category: category
        })
        newProduct.save();
        Usuario.findById( req.params.idUsuario, function(err, user){
            user.products.push(newProduct);
            Usuario.updateOne({_id: req.params.idUsuario},{products: user.products}, function(err, docs){
                if(err){
                    res.send(err);
                }else {
                    res.send( docs);
                }
            })
        })


    }

})

router.delete("/:idUsuario/:idProduct", function(req, res){
    console.log("Borrando producto")
    Usuario.findById(req.params.idUsuario, function(err, user){
        if(err){
            res.send(err);
        }else{
            const newProducts = user.products.filter(product => {
                return product._id.toString() !== req.params.idProduct;
            })
            Usuario.updateOne({_id: req.params.idUsuario }, {products: newProducts}, function(err, result){
                if(err){
                    res.send(err);
                }else {
                    Product.deleteOne({_id: req.params.idProduct}, function(err, resultProduct){
                        if(err){
                            res.send(err);
                        }else {
                            res.send( {
                                success: true,
                                msg: "Producto borrado"
                            });
                        }
                    })
                }
            })
    }
})})

router.put("/:idUsuario/:idProduct", function(req, res){
    const {err} = validateProduct(req.body);
    if(err){
        return res.status(400).send(error.details[0].message);
    } else{
        Usuario.findById(req.params.idUsuario, function(err, user){
            const newProducts = user.products.filter(product => {
                
                return product._id.toString() !== req.params.idProduct;
            })
            newProducts.push(req.body);
            Usuario.updateOne({_id: req.params.idUsuario }, {products: newProducts}, function(err, result){
                if(err){
                    res.send(err);
                }else {
                    Product.updateOne({_id: req.params.idProduct}, function(req, resultProduct){
                        if(err){
                            res.send(err);
                        }else {
                            res.send("Product updated");
                        }
                    })
                }
            })

        })

    }
})

const validateProduct = (product) => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(50).required(),
            price: Joi.number().required(),
            description: Joi.string().min(3).max(1000).required(),
            image: Joi.string().min(3).max(500).required(),
            category: Joi.string().min(3).max(50).required()
        })
    
        return schema.validate(product);
}


module.exports  = router;