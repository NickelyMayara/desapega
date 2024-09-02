import conn from "../config/conn.js"
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"

//helpers
import createUserToken from "../helpers/create-user-token.js"


export const register = (req, res) => { // register -> cadastrar usuários
    const { nome, email, telefone, senha, confirmaSenha } = req.body

    //Validações
    if (!nome) {
        res.status(400).json({ message: "dados no campo de NOME é obrigatório" })
        return
    }

    if (!email) {
        res.status(400).json({ message: "dados no campo de EMAIL é obrigatório" })
        return
    }
    if (!telefone) {
        res.status(400).json({ message: "dados no campo de TELEFONE é obrigatório" })
        return
    }
    if (!senha) {
        res.status(400).json({ message: "dados no campo de SENHA é obrigatório" })
        return
    }
    if (!confirmaSenha) {
        res.status(400).json({ message: "dados no campo de CONFIRMA SENHA é obrigatório" })
        return
    }

    //Verificar se o email é válido
    if (!email.includes("@")) {
        res.status(409).json({ message: "Deve conter '@' no email" })
        return
    }
    //Verificar se a senha é igual
    if (senha !== confirmaSenha) {
        res.status(409).json({ message: "A senha e o campo de confirmação de senha devem ser iguais" })
        return
    }

    const checkSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkSqlData = ["email", email]

    conn.query(checkSql, checkSqlData, async (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json({ err: "Erro ao buscar email para cadastro" })
            return
        }

        if (data.length > 0) {
            res.status(409).json({ err: "O email já está em uso" })
            return
        }

        //Posso fazer registro
        const salt = await bcrypt.genSalt(12)
        console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)

        //Criar usuário
        const id = uuidv4()
        const usuario_img = "userDefault.png"
        const insertSql = /*sql*/ `INSERT INTO usuarios (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?)`
        const insertSqlData = ["usuario_id", "nome", "email", "telefone", "senha", "imagem", id, nome, email, telefone, senhaHash, usuario_img]

        conn.query(insertSql, insertSqlData, (err) => {
            if (err) {
                console.error(err)
                res.status(500).json({ err: "Erro ao cadastrar usuário" })
                return
            }

            // Passar para o front-end

            const usuarioSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
            const usuarioData = ["usuario_id", id]
            conn.query(usuarioSql, usuarioData, async (err, data) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({ err: "Erro ao fazer login" })
                    return
                }
                const usuario = data[0]

                try {
                    await createUserToken(usuario, req, res)
                } catch (error) {
                    console.log(error)
                    res.status(500).json({ err: "Erro ao processar requisição" })
                }

                res.status(200).json({ message: "Usuário Cadastrado" })
            })
        })
    })
}
export const login = (req, res) => { // login -> login dos usuários
    const { email, senha } = req.body

    if (!email) {
        res.status(400).json({ message: "O email é obrigatório" })
        return
    }
    if (!senha) {
        res.status(400).json({ message: "A senha é obrigatório" })
        return
    }

    const checkEmailSql = /*sql*/ `SELECT * FROM usuarios WHERE ?? = ?`
    const checkEmailData = ["email", email]

    conn.query(checkEmailSql, checkEmailData, async (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json({ err: "Erro ao fazer login" })
            return
        }

        if (data.length === 0) {
            res.status(500).json({ err: "E-mail não está cadastro" })
            return
        }

        const usuario = data[0]
        console.log(usuario.senha)

        //Compara senhas
        const comparaSenha = await bcrypt.compare(senha, usuario.senha)
        console.log("Compara senha: ", comparaSenha)
        if (!comparaSenha) {
            res.status(401).json({ message: "Senha incorreta" })
        }
        // Criar um token
        try {
            await createUserToken(usuario, req, res)
        } catch (error) {
            console.error(error)
            res.status(500).json({ err: "Erro ao processar a informação" })
        }
    })

}
export const checkUser = (req, res) => { // checkUser -> Verificar os usuários logado na aplicação
    let usuarioAtual

    if (req.headers.authorization) {
        // extrair o token -> barear TOKEN (pegar apenas o TOKEN)
        const token = getToken(req)
        console.log(token)

        // descriptografar o token -> jwt.decode
        const decoded = jwt.decode(token, "SENHASUPERSEGURA")
        console.log(decoded)

        const usuarioId = decoded.id
        const selectSql = /*sql*/ `SELECT nome, email, telefone, imagem FROM usuarios WHERE ?? = ?`
        const selectData = ["usuario_id", usuarioId]
        conn.query(selectSql, selectData, (err, data) => {
            if (err) {
                console.log(err)
                res.status(500).json({ err: "Erro ao verificar usuário" })
                return
            }
            usuarioAtual = data[0]
            res.status(200).json(usuarioAtual)
        })
        } else {
        usuarioAtual = null
        res.status(200).json(usuarioAtual)
        }
}
export const getUserById = (req, res) => { // getUserById -> Verificar usuário
}
export const editUser = (req, res) => { // editUser -> Controlador Protegido, contém imagem de usuário
}
