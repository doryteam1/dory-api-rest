const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM asociaciones_usuarios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(asociacion_usuario){
    const result = await db.query(
      `INSERT INTO asociaciones_usuarios(cedula_usuario_pk_fk, nit_asociacion_pk_fk) VALUES (?,?)`, 
      [
        asociacion_usuario.cedula_usuario_pk_fk,
        asociacion_usuario.nit_asociacion_pk_fk
      ]
    );
  
    let message = 'Error creando la asociacion del usuario';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Asociacion del usuario creada exitosamente'};
    }
  
    return {message};
  }

  async function update(nit, asociacion_usuario){
    const result = await db.query(
      `UPDATE asociaciones_usuarios 
       SET cedula_usuario_pk_fk=?
       WHERE nit_asociacion_pk_fk=?`,
       [
        asociacion_usuario.cedula_usuario_pk_fk,
        nit
       ] 
    );
  
    let message = 'Error actualizando la asociación del usuario';
  
    if (result.affectedRows) {
      message = 'Asociacion del usuario actualizada exitosamente';
    }
  
    return {message};
  }
  
  async function remove(nit){
    const result = await db.query(
      `DELETE FROM asociaciones_usuarios WHERE nit_asociacion_pk_fk=?`, 
      [nit]
    );
  
    let message = 'Error borrando la asociacion del usuario';
  
    if (result.affectedRows) {
      message = 'Asociación de usuario borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}