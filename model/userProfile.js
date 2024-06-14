const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsuarioPerfil = sequelize.define('UsuarioPerfil', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuario',
            key: 'id'
        },
        field: 'id_usuario'
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
    tableName: 'usuario_perfil',
    timestamps: false
});

module.exports = UsuarioPerfil;