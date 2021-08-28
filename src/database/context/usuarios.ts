import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface UsuariosAttributes {
    id: number;
    nome : string;
    login : string;
    email : string;
    senha : string;
    administrador : boolean;
    idOrganizacao : number;
    
}

export interface UsuariosInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    
    nome: string;
    login: string;
    email: string;
    senha: string;
    administrador : boolean;
    idOrganizacao : number;
}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var usuarios = sequelize.define('usuarios', {
        nome: DataTypes.STRING(100),
        login: DataTypes.STRING(100),
        email: DataTypes.STRING(100),
        senha: DataTypes.STRING,
        administrador: DataTypes.BOOLEAN,
        idOrganizacao: DataTypes.INTEGER
    });

    usuarios.associate = function(models) {
        // associations can be defined here
    };

    return usuarios;
};
