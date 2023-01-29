const bcrypt = require('bcrypt')
let jwt = require("jsonwebtoken");
const Usuario = require("./usuario.controller")
const jwtKey = process.env.JSON_TOKEN;

async function login(user){
    const {email, password} = user;
    if(email && password){
        const currentUser = await findUser(email);
            if(currentUser){
                console.log(currentUser)
                const validation = bcrypt.compare(password, currentUser.password)     
                    console.log("holaaa")           
                    if(validation){
                        let token = jwt.sign({ email, nombre: currentUser.lName }, jwtKey, {
                            expiresIn: "2h",
                          });
                        return {
                            success: true,
                            msg: "Logged successfully",
                            token,
                            user: currentUser
                          };
                    } else{
                        return {
                            success: false,
                            msg: "Incorrect email and/or password",
                          };
                    }
            }
            else{
                return {
                    success: false,
                    msg: "Incorrect email and/or password",
                  };
            }
        
    }else{
        return {
            success: false,
            msg: "Incorrect email and/or password",
          };
    }
}

findUser = async (email) =>{
    return await Usuario.findOne({email: email})
}

module.exports = { login };