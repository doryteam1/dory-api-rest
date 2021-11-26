const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM proyectos_municipios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(proyecto_municipio){
    const result = await db.query(
      `INSERT INTO proyectos_municipios(id_proyecto_pk_fk, id_municipio_pk_fk) VALUES (?,?)`, 
      [
        proyecto_municipio.id_proyecto_pk_fk,
        proyecto_municipio.id_municipio_pk_fk
      ]
    );
  
    let message = 'Error al crear el proyecto al municipio';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Proyecto de municipio creado exitosamente'};
    }
  
    return {message};
  }

  async function update(id, proyecto_municipio){
    const result = await db.query(
      `UPDATE proyectos_municipios 
       SET id_municipio_pk_fk=?
       WHERE id_proyecto_pk_fk=?`,
       [
        proyecto_municipio.id_municipio_pk_fk,
        id
       ] 
    );
  
    let message = 'Error al actualizar el proyecto al municipio';
  
    if (result.affectedRows) {
      message = 'Proyecto de municipio actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM proyectos_municipios WHERE id_proyecto_pk_fk=?`, 
      [id]
    );
  
    let message = 'Error al borrar el proyecto al municipio';
  
    if (result.affectedRows) {
      message = 'Proyecto de municipio borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}