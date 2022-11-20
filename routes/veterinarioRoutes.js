import express from 'express'
import { registrar, 
    perfil,
    confirmar, 
    autenticar, 
    olvidePassword,
    comprobarToken,
    nuevoPassword, 
    actualizarPerfil} 
    from '../controllers/veterinarioController.js';
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', registrar)


router.get("/confirmar/:token",confirmar)
router.post("/login", autenticar)
router.post("/olvide-password", olvidePassword)

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)


router.get("/perfil",checkAuth,perfil )
router.put("/perfil/:id", checkAuth, actualizarPerfil)
export default router;