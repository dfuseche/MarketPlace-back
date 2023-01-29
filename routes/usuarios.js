
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Usuario = require("../controllers/usuario.controller");
const bcrypt = require('bcrypt');
const saltRounds = 10;
let jwt = require("jsonwebtoken");
const jwtKey = process.env.JSON_TOKEN;


router.get("/", function(req, res){
    Usuario.find({}, (err, result) =>{
        res.send(result);
    })
})

router.get("/:id", function(req, res){
    Usuario.findById(req.params.id, (err, result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    })
})

router.post("/", function(req, res){
    const {error} = validateUser(req.body);
    console.log(req.body)
    if(error){
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message);
    }
    else {
        const {fName, lName, email, cedula, telephone, password, address} = req.body;
        let hashPassword = ""
        bcrypt.hash(password, saltRounds, function(err, hash) {
            hashPassword = hash;
        });
        console.log(hashPassword)
        Usuario.findOne({email: email}, function(err, result){
            if(!result){
                const token = jwt.sign({ email, lName }, jwtKey);
                const nuevoUsuario = new Usuario ({
                    fName: fName ,
                    lName: lName,
                    email: email,
                    cedula: cedula,
                    telephone: telephone,
                    password: hashPassword,
                    address: address
                })
                nuevoUsuario.save(function(err){
                    if(err){
                        res.send(err);
                    }else{
                        res.cookie("token", token, { httpOnly: true });
                        res.send( {
                            success: true,
                            msg: "Usuario creado",
                            user: nuevoUsuario
                        });
                    }
                });
            }
            else{
                console.log("ya existe")
                return res.status(401).send("El usuario con ese correo ya existe");
            }
        })
        
    }

    
})

router.put("/:id", function(req, res){
    const {error} = validateUser(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
    else {
        Usuario.updateOne({_id: req.params.id}, req.body, function(err, docs){
            if (err){
                res.send(err)
            }
            else{
                console.log("Updated Docs : ", docs);
                res.send("The user has been updated")
            }
        })
    }
})

router.delete("/:id", function(req, res){
    Usuario.deleteOne({_id: req.params.id}, function(err, result){
        if(err){
            res.send(err);
        }else{
            res.send("The user has been deleted");
        }
        
    })
})


const validateUser = (user) => {
    const schema = Joi.object({
        fName: Joi.string().min(3).max(30).required(),
        lName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        cedula: Joi.string().min(4).max(15).required(),
        telephone: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(3).max(30).required(),
        address: Joi.string().min(3).max(30).required()
    })

    return schema.validate(user);
}


module.exports  = router;