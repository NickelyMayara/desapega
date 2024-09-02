import conn from "../config/conn.js"

const tabelaUsuario = /*sql*/`
    CREATE TABLE IF NOT EXISTS usuarios(
    usuario_id VARCHAR(60) PRIMARY KEY, nome VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL,  telefone VARCHAR(50) NOT NULL, senha VARCHAR(255) NOT NULL, imagem VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`

conn.query(tabelaUsuario, (error, result, field) => {
    if(error){
        console.error("Erro ao criar tabela" + error.stack)
    }
    console.log("Tabela [usuario] criada com sucesso")
})