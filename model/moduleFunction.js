const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const ModuloFuncao = sequelize.define('ModuloTransacao', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idModulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modulos', // Nome da tabela de módulos
            key: 'id_modulo'
        },
        field: 'id_modulo'
    },
    idFuncao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'funcao', // Nome da tabela de transações
            key: 'id_funcao'
        },
        field: 'id_funcao'
    }
}, {
    tableName: 'modulofuncao',
    timestamps: false
});

module.exports = ModuloFuncao;