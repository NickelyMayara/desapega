import "dotenv/config"
import express from "express"
import cors from "cors"

// Conexão com banco de dados
import conn from "./config/conn.js"

// Importar as rotas
import usuarioRouter from "./routes/usuarioRoutes.js"

const PORT = process.env.PORT || 3333
const app = express()

// 3 middleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Importar modulos
import "./models/usuarioModel.js"

// Utilizar rotas
app.use("/usuarios", usuarioRouter)

app.get("*", (req, res) => {
    res.status(404).json({message: "Rota não encontrada"})
}) 

app.listen(PORT, ()=> {
    console.log(`Servidor on PORT ${PORT}🟢`)
})