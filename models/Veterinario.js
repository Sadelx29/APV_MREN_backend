import mongoose from "mongoose";
import bcrypt from "bcrypt"
import generarId from "../helpers/generarid.js";


const veterinariosSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
    type:String,
    requiered: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId(),

    },
    confirmado: {
        type: Boolean,
        default: false
    }
})


////////////////esto convertira la clave en #####////////////////////////////////
veterinariosSchema.pre('save', async function(next){

    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    

})



//////////////////////////////////////////////////////////////////////////////

veterinariosSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}


const Veterinario = mongoose.model("Veterinario", veterinariosSchema)

export default Veterinario;