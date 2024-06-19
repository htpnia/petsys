const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chave';

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Corrigido para 'authorization' em minúsculas
    console.log('Header de Autorização recebido no middleware:', authHeader); // Verifique o cabeçalho no console

    if (!authHeader) {
        console.log('Authorization header not found');
        return res.status(401).json({ success: false, message: 'Acesso negado, token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído do header de Autorização:', token); // Verifique o token extraído

    if (!token) {
        return res.status(401).json({ success: false, message: 'Acesso negado, token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token decodificado no middleware:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Erro na verificação do token no middleware:', error);
        res.status(400).json({ success: false, message: 'Token inválido' });
    }
};

module.exports = authenticate;
