const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM tipos_usuarios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(tipo_usuario){
     const result = await db.query(
      `INSERT INTO tipos_usuarios(id_tipo_usuario,nombre_tipo_usuario) VALUES (?,?)`, 
      [
        tipo_usuario.id_tipo_usuario,
        tipo_usuario.nombre_tipo_usuario,
      ]
    );
  
    let message = 'Error creando tipo de usuario';
  
    if (result.affectedRows) {
      message = 'Tipo de usuario creado exitosamente';
    }
  
    return {message};
  }

  async function update(id, tipo_usuario){
    const result = await db.query(
      `UPDATE tipos_usuarios 
       SET nombre_tipo_usuario=? 
       WHERE id_tipo_usuario=?`,
       [
         tipo_usuario.nombre_tipo_usuario,
         id
       ] 
    );
  
    let message = 'Error actualizando tipo usuario';
  
    if (result.affectedRows) {
      message = 'Tipo usuario actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM tipos_usuarios WHERE id_tipo_usuario=?`, 
      [id]
    );
  
    let message = 'Error borrando tipo usuario';
  
    if (result.affectedRows) {
      message = 'Tipo usuario borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}