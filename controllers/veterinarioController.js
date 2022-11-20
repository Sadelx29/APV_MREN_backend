import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarid.js"
import emailRegistro from "../helpers/emailRegistro.js"
import EmailOlvidePassword from "../helpers/emailOlvidePassword.js"

////////////////////SECCION CREAR UN USUARIO/////////////////////////////////
const registrar = async (req,res)=>{
    console.log('llego el loco')
    console.log(req.body)
    const {email,password,nombre} = req.body


///////////////VALIDAR SI EL USUARI ESTA DUPLICADO//////////////////

    const existeUsuario = await Veterinario.findOne({email})

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg: error.message})
    }

///////////////////////////////////////////////////////////////////

/////////////////////GUARDAR UN NUVEO USUARIO/////////////////////////////
    try {
        //guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save()

        //enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })


        res.json({ veterinarioGuardado})
        
    } catch (error) {
        console.log(error)
    }
//////////////////////////////////////////////////////////////////////////    

}

const perfil = (req,res) =>{

    const {veterinario} = req;
    
    res.json(veterinario)
}
///////////////////////CONFIRMAR TOKEN DE USUARIO//////////////////////////
const confirmar = async (req,res) => {
    
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error("Token no valido")
        return res.status(404).json({msg: error.message})
    }

    
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true
        await usuarioConfirmar.save()

        res.json({msg: "Usuario Confirmado Correctamente"})
    } catch (error) {
        console.log(error)
    }
     
    
}
///////////////////////////////////////////////////////////

//////////////////////HACIENDO EL LOGIN/////////////////////////////////////
const autenticar =  async (req,res) => {
    console.log(req.body)
    const {email, password} = req.body

    //comprobar si el usuario existe

    const usuario = await Veterinario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

//////////////////////////COMPROBAR QUE EL USUARIO ESTE CONFIRMADO/////////////////////////
if(!usuario.confirmado){
    const error = new Error("Este usuario no a confirmado su cuenta")
    return res.status(404).json({msg: error.message})
}

////////////////////////////REVISAR SI EL PASSWORD ES CORRECTO/////////////////////////

if(await usuario.comprobarPassword(password)){
    //autenticar
    console.log(usuario)
    usuario.token = generarJWT(usuario.id)
    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
        

    })
    console.log('password correcto')
} else {
    const error = new Error("el password es incorrecto")
    return res.status(404).json({msg: error.message})
}

}

const olvidePassword = async (req,res) => {
    const {email} = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error('El usuario no existe')
        return res.status(400).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()
        res.json({msg: 'Hemos enviado un email con las instucciones'})

        EmailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })


    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req,res) => {
    const {token} = req.params
    
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        ///EL TOKEN es valido, el usuario existe
        res.json({msg: "token valido y el usuario existe"})
    }else{
        const error = new Error('el token no es valido')
        return res.status(400).json({msg: error.message})
        
    }
    
}

const nuevoPassword = async (req,res) => {

    const {token} = req.params
    const {password} = req.body
    
    const veterinario = await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('hubo un error')
        return res.status(400).json({msg: error.message})

    }

    try {
        veterinario.token  = null;
        veterinario.password = password
        await veterinario.save()
        res.json({msg: "password modificado correctamente"})
        
    } catch (error) {
        console.log(veterinario)
    }
    
}

const actualizarPerfil =  async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    console.log(veterinario)
    if(!veterinario){
        const error = new Error('hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        const error = new Error("ese email existe")
        return res.status(400).json({msg: error.message})
    }

    try {
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
    console.log(req.body)
}
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil
}