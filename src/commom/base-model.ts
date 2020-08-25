
import {validate, IsNumber } from 'class-validator';

export abstract class BaseModel {

  @IsNumber({allowNaN: true})
  public id: number;

  validar() : Promise<string[]> {
    return new Promise(resolve => {
      let erros = [];

      validate(this).then(errors => {

        errors.map(error => {
          Object.keys(error.constraints).map(constraint => {
            erros.push(error.constraints[constraint]);
          });
        });

        resolve(erros);
      });
    });
  };

  constructor() {
    this.id = NaN;
  };
}