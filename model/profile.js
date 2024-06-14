const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const Perfil = sequelize.define('Perfil', {
    idPerfil: { // Nome mais adequado para o atributo no modelo Sequelize
        type: DataTypes.INTEGER,
        primaryKey: true, // Explicitamente definindo como chave primária
        autoIncrement: true, // Especifica que esta coluna é auto-incremental
        field: 'id_perfil' // Mapeia este campo para a coluna 'id_perfil' no banco de dados
    },
    nomePerfil: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_perfil' // Mapeia para a coluna 'nome_perfil' no banco de dados
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true, // Permitir nulo
        field: 'descricao_perfil' // Mapeia para a coluna 'descricao' no banco de dados
    }
}, {
    tableName: 'perfil',
    timestamps: false // Desabilita os campos createdAt e updatedAt
});

module.exports = Perfil;
