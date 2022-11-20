import Paciente from "../models/Paciente.js"

const agregarPaciente = async (req, res) =>{

    console.log(req.body)
    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id
    


    try {
        
        const pacienteAlmacenado = await paciente.save()
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error)
    }


}

const obtenerPacientes = async (req, res) =>{
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario)

    res.json(pacientes)

}

const obtenerPaciente = async (req, res) =>{
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    
    if(!paciente){
        res.status(404).json({msg: ' no encontrado'})
     }

     if(String(paciente.veterinario._id) !== String(req.veterinario._id)){
         return res.json({msg: 'accion no valida'})
     }

     if(paciente){
        res.json(paciente)
     }
      
}

const actualizarPaciente = async (req, res) =>{
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    
    if(!paciente){
        res.status(404).json({msg: ' no encontrado'})
    }

    if(String(paciente.veterinario._id) !== String(req.veterinario._id)){
         return res.json({msg: 'accion no valida'})
    }

    //actualizat paciente

    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas




    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)

    } catch (error) {
        console.log(error)
    }

}
const eliminarPaciente = async (req, res) =>{
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    
    if(!paciente){
        res.status(404).json({msg: ' no encontrado'})
    }

    if(String(paciente.veterinario._id) !== String(req.veterinario._id)){
         return res.json({msg: 'accion no valida'})
    }


    try {
        await paciente.deleteOne()
        res.json({msg:"paciente eliminado"})

    } catch (error) {
        console.log(error)
    }

}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}
