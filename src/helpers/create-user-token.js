// O Token da conta é uma chave de uso confidencial responsável pela integração direta entre um sistema e outro. Em uma interpretação mais técnica, essa chave permite que sistemas sejam conectados trocando parâmetros de URL, por meio de códigos ID.

import jwt from "jsonwebtoken"

const createUserToken = async (usuario, req, res) => {
    // Criar token

    const token = jwt.sign( // método que permite criar um token
    {
        nome: usuario.nome,
        id: usuario.usuario_id
    },
    "SENHASUPERSEGURA" // Senha de criptografia
    ) 

    // Retornar token

    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        usuarioId: usuario.usuario_id
    })
}

export default createUserToken