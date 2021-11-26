const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM eventos LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
console.log('eventos'+rows);
  return {
    data,
    meta
  }
}


async function create(evento){
    const result = await db.query(
      `INSERT INTO eventos(id_evento,nombre,resumen,fecha, hora, imagen, url, dirigidoa, organizador, costo, id_modalidad_fk, id_tipo_evento_fk) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        evento.id_evento,
        evento.nombre,
        evento.resumen,
        evento.fecha,
        evento.hora,
        evento.imagen,
        evento.url,
        evento.dirigidoa,
        evento.organizador,
        evento.costo,
        evento.id_modalidad_fk, 
        evento.id_tipo_evento_fk
      ]
    );
  
    let message = 'Error creando la evento';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'evento creada exitosamente'};
    }
  
    return {message};
  }

  async function update(id, evento){
    const result = await db.query(
      `UPDATE eventos 
       SET cedula_usuario_pk_fk=?,
           id_granja_pk_fk=?,
           descripcion=?,
           fecha=?
       WHERE id_evento=?`,
       [
        evento.cedula_usuario_pk_fk,
        evento.id_granja_pk_fk,
        evento.descripcion,
        evento.fecha,
        id
       ] 
    );
  
    let message = 'Error actualizando la evento';
  
    if (result.affectedRows) {
      message = 'evento actualizada exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM eventos WHERE id_evento=?`, 
      [id]
    );
  
    let message = 'Error borrando la evento';
  
    if (result.affectedRows) {
      message = 'evento borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}