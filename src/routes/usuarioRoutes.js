import { Router } from "express";
import { register, login, checkUser } from "../controllers/usuarioController.js";

const router = Router()

router.post("/register", register); //cadastrar
router.post("/login", login); //login
router.get("/checkuser", checkUser); //verificação de usuários

export default router;