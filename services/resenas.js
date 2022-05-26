const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getResenasGranja(page = 1,idGranja){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinct r.id_reseña, r.descripcion, r.fecha, r.usuarios_id as id_usuario, r.id_granja_pk_fk as id_granja, g.nombre as nombre_granja
    FROM reseñas as r, granjas as g, usuarios_granjas as ug
    WHERE r.id_granja_pk_fk=g.id_granja and 
          g.id_granja=ug.id_granja_pk_fk and
          g.id_granja=?
           LIMIT ?,?`, 
    [idGranja,offset, config.listPerPage]
  );

  const rowspuntajes = await db.query(
    `SELECT distinct   avg(ug.puntuacion) as puntaje
    FROM  granjas as g, usuarios_granjas as ug
    WHERE g.id_granja=ug.id_granja_pk_fk and
          g.id_granja=?`, 
    [idGranja,offset, config.listPerPage]
  );

  var data = [];
  data[0] = {}; 
  data[0].resenas = helper.emptyOrRows(rows);
  data[0].puntaje = rowspuntajes[0];
  data[0].id_granja = idGranja;
  const meta = {page};

  return {
    data,
    meta
  }
}/*End getResenasGranja*/

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
      `INSERT INTO reseñas(id_reseña, id_granja_pk_fk, usuarios_id, descripcion, fecha) VALUES (?,?,?,?,?)`, 
      [
        reseña.id_reseña,
        reseña.id_granja_pk_fk,
        reseña.usuarios_id,
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
       SET id_granja_pk_fk=?,
           usuarios_id=?,
           descripcion=?,
           fecha=?
       WHERE id_reseña=?`,
       [
        reseña.id_granja_pk_fk,
        reseña.usuarios_id,
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
  getResenasGranja,
  getMultiple,
  create,
  update,
  remove
}