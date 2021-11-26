const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM proyectos_subregiones LIMIT ?,?`, 
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
      `INSERT INTO proyectos_subregiones(id_proyecto_pk_fk, id_subregion_pk_fk) VALUES (?,?)`, 
      [
        proyecto_municipio.id_proyecto_pk_fk,
        proyecto_municipio.id_subregion_pk_fk
      ]
    );
  
    let message = 'Error al crear el proyecto a la subregión';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Proyecto de subregión creado exitosamente'};
    }
  
    return {message};
  }

  async function update(id, proyecto_subregion){
    const result = await db.query(
      `UPDATE proyectos_subregiones 
       SET id_subregion_pk_fk=?
       WHERE id_proyecto_pk_fk=?`,
       [
        proyecto_subregion.id_subregion_pk_fk,
        id
       ] 
    );
  
    let message = 'Error al actualizar el proyecto a la subregión';
  
    if (result.affectedRows) {
      message = 'Proyecto de subregión actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM proyectos_subregiones WHERE id_proyecto_pk_fk=?`, 
      [id]
    );
  
    let message = 'Error al borrar el proyecto a la subregión';
  
    if (result.affectedRows) {
      message = 'Proyecto de subregión borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}