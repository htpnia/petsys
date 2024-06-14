const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const ModuloTransacao = sequelize.define('ModuloTransacao', {
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
    idTransacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'transacao', // Nome da tabela de transações
            key: 'id_transacao'
        },
        field: 'id_transacao'
    }
}, {
    tableName: 'modulos_transacoes',
    timestamps: false
});

module.exports = ModuloTransacao;