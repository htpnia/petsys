const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const Modulo = sequelize.define('Modulo', {
    idModulo: { // Nome mais adequado para o atributo no modelo Sequelize
        type: DataTypes.INTEGER,
        primaryKey: true, // Explicitamente definindo como chave primária
        autoIncrement: true, // Especifica que esta coluna é auto-incremental
        field: 'id_modulo' // Mapeia este campo para a coluna 'id_modulo' no banco de dados
    },
    nomeModulo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_modulo' // Mapeia para a coluna 'nome_modulo' no banco de dados
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true, // Permitir nulo
        field: 'descricao_modulo' // Mapeia para a coluna 'descricao' no banco de dados
    }
}, {
    tableName: 'modulo',
    timestamps: false // Desabilita os campos createdAt e updatedAt
});

module.exports = Modulo;
