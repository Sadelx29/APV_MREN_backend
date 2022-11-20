import  Jwt  from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js"
const checkAuth = async (req, res, next) => {
    let token

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer'))
        {
        console.log('si tiene el toquen con bearer')



        try {

            token = req.headers.authorization.split(" ")[1]
            console.log(token)

            const decoded = Jwt.verify(token, process.env.JWT_SECRET)

            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado")
            console.log('soy el req.veterinario', req.veterinario._id)

           return next()

        } catch (error) {
            const e = new Error('token no valido o inexistente')
            res.status(403).json({msg: error.message})
        }
    } 

    if(!token){
        const error = new Error('token no valido o inexistente')
        res.status(403).json({msg: error.message})
    }

    next();
}

export default checkAuth