const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Verifique se o caminho está correto

const PerfilModulo = sequelize.define('PerfilModulo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idPerfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'perfil', // Nome da tabela de módulos
            key: 'id_perfil'
        },
        field: 'id_perfil'
    },
    idModulo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modulo', // Nome da tabela de transações
            key: 'id_modulo'
        },
        field: 'id_modulo'
    }
}, {
    tableName: 'perfilmodulo',
    timestamps: false
});

module.exports = PerfilModulo;