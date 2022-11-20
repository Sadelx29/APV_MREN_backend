import  express  from "express";
import dotenv from "dotenv"
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import cors from 'cors'

const app = express();

// de esta manera se envian los datos a expres con el request 
app.use(express.json());

//con esto se integra las configuraciones ocultas
dotenv.config();

//esto conecta la base de datos desde config
conectarDB()


///////////////////////permitir dominio para que se conecte la api 
const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1 ){

            callback(null, true)
        } else {
            callback(new Error('no permitido por cors'))
        }

    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios',veterinarioRoutes )
app.use('/api/pacientes', pacienteRoutes )

//asi se declara el puerto para que sea 4000
const PORT = process.env.PORT || 4000
app.listen(PORT, () =>{
    console.log(`servidor funcionando en puerto ${PORT}`)
});

