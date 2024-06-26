const jwt = require('jsonwebtoken');
const SECRET_KEY = 'chave';

module.exports = function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Header de Autorização recebido no middleware:', authHeader);

    if (authHeader) {
        const token = authHeader.split(' ')[1]; 

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403); 
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Authorization header not found' });
    }
};