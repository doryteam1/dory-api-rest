const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM especies_usuarios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(especie_usuario){
    const result = await db.query(
      `INSERT INTO especies_usuarios(usuarios_id,id_especie_pk_fk,cantidad_consumo) VALUES (?,?,?)`, 
      [
        especie_usuario.usuarios_id,
        especie_usuario.id_especie_pk_fk, 
        especie_usuario.cantidad_consumo
      ]
    );
  
    let message = 'Error creando especie de usuario';
  
    if (result.affectedRows) {
      message = 'Especie de usuario creada exitosamente';
    }
  
    return {message};
  }

  async function update(id, especie_usuario){
    const result = await db.query(
      `UPDATE especies_usuarios
       SET usuarios_id=?,
           cantidad_consumo=? 
       WHERE id_especie_pk_fk=?`,
       [
         especie_usuario.usuarios_id,
         especie_usuario.cantidad_consumo,
         id
       ] 
    );
  
    let message = 'Error actualizando especie de usuario';
  
    if (result.affectedRows) {
      message = 'Especie de usuario actualizada exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM especies_usuarios WHERE id_especie_pk_fk=?`, 
      [id]
    );
  
    let message = 'Error borrando especie de usuario';
  
    if (result.affectedRows) {
      message = 'especie de usuario borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}