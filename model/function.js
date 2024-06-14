const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const Funcao = sequelize.define('Funcao', {
    idFuncao: { // Nome mais adequado para o atributo no modelo Sequelize
        type: DataTypes.INTEGER,
        primaryKey: true, // Explicitamente definindo como chave primária
        autoIncrement: true, // Especifica que esta coluna é auto-incremental
        field: 'id_funcao' // Mapeia este campo para a coluna 'id_perfil' no banco de dados
    },
    nomeFuncao: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        field: 'nome_funcao' // Mapeia para a coluna 'nome_funcao' no banco de dados
    },
    descricao: {
        type: DataTypes.STRING(255),
        allowNull: true, // Permitir nulo
        field: 'descricao_funcao' // Mapeia para a coluna 'descricao' no banco de dados
    }
}, {
    tableName: 'Funcao',
    timestamps: false // Desabilita os campos createdAt e updatedAt
});

module.exports = Funcao;