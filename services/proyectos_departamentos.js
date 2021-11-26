const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM proyectos_departamentos LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(proyecto_departamento){
    const result = await db.query(
      `INSERT INTO proyectos_departamentos(id_proyecto_pk_fk, id_departamento_pk_fk) VALUES (?,?)`, 
      [
        proyecto_departamento.id_proyecto_pk_fk,
        proyecto_departamento.id_departamento_pk_fk
      ]
    );
  
    let message = 'Error al crear el proyecto al departamento';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Proyecto de departamento creado exitosamente'};
    }
  
    return {message};
  }

  async function update(id, proyecto_departamento){
    const result = await db.query(
      `UPDATE proyectos_departamentos 
       SET id_departamento_pk_fk=?
       WHERE id_proyecto_pk_fk=?`,
       [
        proyecto_departamento.id_departamento_pk_fk,
        id
       ] 
    );
  
    let message = 'Error al actualizar el proyecto al departamento';
  
    if (result.affectedRows) {
      message = 'Proyecto de departamento actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM proyectos_departamentos WHERE id_proyecto_pk_fk=?`, 
      [id]
    );
  
    let message = 'Error al borrar el proyecto al departamento';
  
    if (result.affectedRows) {
      message = 'Proyecto de departamento borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}