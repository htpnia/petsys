const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajuste o caminho conforme necessário
const Perfil = require('./profile'); // Verifique se o caminho está correto


// Define o modelo 'Usuario'
const Usuario = sequelize.define('usuario', {
    // Atributos do modelo
    idUsuario: { 
        type: DataTypes.INTEGER,
        primaryKey: true, // Explicitamente definindo como chave primária
        autoIncrement: true, // Especifica que esta coluna é auto-incremental
        field: 'id_usuario' // Mapeia este campo para a coluna 'id_perfil' no banco de dados
    }, 

    nomeUsuario: {
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
    },

    acessoSistema: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'acesso_sistema'
    },

    idPerfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'perfil',
            key: 'id_perfil'
        },
        field: 'id_perfil'
    }
    
}, {
    // Opções do modelo
    tableName: 'usuario',
    timestamps: false, // Sequelize adiciona automaticamente os campos createdAt e updatedAt
    
});

Usuario.belongsTo(Perfil, { foreignKey: 'idPerfil' });

// Exporta o modelo
module.exports = Usuario;
