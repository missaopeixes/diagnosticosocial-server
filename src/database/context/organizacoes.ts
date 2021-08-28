import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface OrganizacoesAttributes {
    id: number;
    nome: string;
    /*logo: string;
    cnpj: string;*/
}

export interface OrganizacoesInstance {
    id: number;
    nome: string;
    createdAt: Date;
    updatedAt: Date;
    /*logo: string;
    cnpj: string;*/
}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var organizacoes = sequelize.define('organizacoes', {
        nome: DataTypes.STRING(100)
    });

    organizacoes.associate = function(models) {
        // associations can be defined here

        /*organizacoes.hasMany(models.usuarios, {
            as: 'organizacaoUsuarios',
            foreignKey: 'idOrganizacao'
        });*/
    };

    return organizacoes;
};
