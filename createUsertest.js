const bcrypt = require('bcrypt');
const Usuario = require('./model/user'); // Ajuste o caminho conforme necessário
const sequelize = require('./config/db');



async function createTestUser() {
    const nomeusuario = 'admin';
    const email = 'admin@gmail.com';
    const matricula = '1234568';
    const senha = 'admin';
    const idPerfil = 1;


    try {
        await sequelize.sync(); // Certifique-se de que o banco de dados está sincronizado
        const novoUsuario = await Usuario.create({ nomeusuario, email, matricula, senha, idPerfil });
        console.log('Usuário criado com sucesso:', novoUsuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

createTestUser();