const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM reseñas LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
console.log('reseñas'+rows);
  return {
    data,
    meta
  }
}


async function create(reseña){
    const result = await db.query(
      `INSERT INTO reseñas(id_reseña,cedula_usuario_pk_fk, id_granja_pk_fk, descripcion,fecha) VALUES (?,?,?,?,?)`, 
      [
        reseña.id_reseña,
        reseña.cedula_usuario_pk_fk,
        reseña.id_granja_pk_fk,
        reseña.descripcion,
        reseña.fecha
      ]
    );
  
    let message = 'Error creando la reseña';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Reseña creada exitosamente'};
    }
  
    return {message};
  }

  async function update(id, reseña){
    const result = await db.query(
      `UPDATE reseñas 
       SET cedula_usuario_pk_fk=?,
           id_granja_pk_fk=?,
           descripcion=?,
           fecha=?
       WHERE id_reseña=?`,
       [
        reseña.cedula_usuario_pk_fk,
        reseña.id_granja_pk_fk,
        reseña.descripcion,
        reseña.fecha,
        id
       ] 
    );
  
    let message = 'Error actualizando la reseña';
  
    if (result.affectedRows) {
      message = 'Reseña actualizada exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM reseñas WHERE id_reseña=?`, 
      [id]
    );
  
    let message = 'Error borrando la reseña';
  
    if (result.affectedRows) {
      message = 'Reseña borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}