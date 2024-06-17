const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário

// Define o modelo 'Usuario'
const Usuario = sequelize.define('usuario', {
    // Atributos do modelo
    idUsuario: { 
        type: DataTypes.INTEGER,
        primaryKey: true, // Explicitamente definindo como chave primária
        autoIncrement: true, // Especifica que esta coluna é auto-incremental
        field: 'id_usuario' // Mapeia este campo para a coluna 'id_perfil' no banco de dados
    }, 

    nomeusuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'nome_usuario'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email'
    },
    matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'matricula'
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'senha'
    }
    
}, {
    // Opções do modelo
    tableName: 'usuario',
    timestamps: false // Sequelize adiciona automaticamente os campos createdAt e updatedAt
});

// Exporta o modelo
module.exports = Usuario;
