const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM infraestructuras_granjas LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(infraestructura_granja){
    const result = await db.query(
      `INSERT INTO infraestructuras_granjas(id_granja_pk_fk,id_infraestructura_pk_fk) VALUES (?,?)`, 
      [
       infraestructura_granja.id_granja_pk_fk,
       infraestructura_granja.id_infraestructura_pk_fk
      ]
    );
  
    let message = 'Error creando infraestructura de la granja';
  
    if (result.affectedRows) {
      message = 'La infraestructura de la granja se registro exitosamente';
    }
  
    return {message};
  }

  async function update(id, infraestructura_granja){
    const result = await db.query(
      `UPDATE infraestructuras_granjas
       SET id_infraestructura_pk_fk=?
           WHERE id_granja_pk_fk=?`,
       [
         infraestructura_granja.id_infraestructura_pk_fk,
         id
       ] 
    );
  
    let message = 'Error actualizando la infraestructura de la granja';
  
    if (result.affectedRows) {
      message = 'Infraestructura de la granja actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM infraestructuras_granjas WHERE id_granja_pk_fk=?`, 
      [id]
    );
  
    let message = 'Error borrando infraestructura de la granja';
  
    if (result.affectedRows) {
      message = 'Registro de infraestructura de la granja borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}