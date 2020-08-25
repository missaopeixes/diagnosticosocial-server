import {
    Sequelize,
    DataTypes
} from 'sequelize';

export interface EntrevistasAttributes {

    id : number;
    nome : string;
    idEvento : number;
    idUsuario : number;
    observacoes : string;
    concluida : boolean;
}

export interface EntrevistasInstance {
    id: number;
    nome ? : number;
    idEvento : number;
    idUsuario : number;
    observacoes : string;
    concluida : boolean;

    createdAt: Date;
    updatedAt: Date;

}

export default (sequelize: Sequelize, DataTypes: DataTypes) => {
    var entrevistas = sequelize.define('entrevistas', {
        nome: DataTypes.STRING,
        idEvento: DataTypes.INTEGER,
        idUsuario: DataTypes.INTEGER,
        concluida: DataTypes.BOOLEAN,
        observacoes: DataTypes.STRING({ length: 500 })
    });

    entrevistas.associate = function(models) {
        // associations can be defined here

        entrevistas.hasMany(models.questionariosRespondidos, {
            as: 'questionariosRespondidos',
            foreignKey: 'idEntrevista'
        });
    };

    return entrevistas;
};
