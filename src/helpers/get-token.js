const getToken = (req) => {
    // extrair token
    const authHeader = req.headers.authorization
    // (baerer token)
    const token = authHeader.split(" ")[1]
    
    return token
}

export default getToken