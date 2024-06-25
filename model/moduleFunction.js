const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModuloFuncao = sequelize.define('ModuloFuncao', {
    id_modulofuncao: {
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
    id_funcao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Funcao',
            key: 'id_funcao'
        }
    }
}, {
    tableName: 'modulofuncao',
    timestamps: false
});

module.exports = ModuloFuncao;
