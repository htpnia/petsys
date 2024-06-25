const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModuloTransacao = sequelize.define('ModuloTransacao', {
    id_modulotransacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_modulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Modulo',
            key: 'id_modulo'
        }
    },
    id_transacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Transacao',
            key: 'id_transacao'
        }
    }
}, {
    tableName: 'modulotransacao',
    timestamps: false
});

module.exports = ModuloTransacao;
