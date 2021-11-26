const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT normatividades.id as id_normatividad, concat(tipos_normatividades.nombre,' ',normatividades.nombre) as nombre,  normatividades.contenido AS contenido,normatividades.url_descarga AS url_descarga, normatividades.id_tipo_fk as id_tipo,tipos_normatividades.nombre AS tipo, normatividades.fecha as fecha
    FROM normatividades,tipos_normatividades
    WHERE normatividades.id_tipo_fk=tipos_normatividades.id_tipo LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(normatividad){
    const result = await db.query(
      `INSERT INTO normatividades(id,nombre, contenido,url_descarga,id_tipo_fk,fecha) VALUES (?,?,?,?,?,?)`, 
      [
       normatividad.id,
       normatividad.nombre, 
       normatividad.contenido,
       normatividad.url_descarga, 
       normatividad.id_tipo_fk,
       normatividad.fecha       
      ]
    );
  
    let message = 'Error creando normatividad';
  
    if (result.affectedRows) {
      message = 'La normatividad se registro exitosamente';
    }
  
    return {message};
  }

  async function update(id, normatividad){
    const result = await db.query(
      `UPDATE normatividades
       SET nombre=?,
           contenido=?,
           url_descarga=?, 
           id_tipo_fk=?,
           fecha=?
       WHERE id=?`,
       [
        normatividad.nombre, 
        normatividad.contenido,
        normatividad.url_descarga, 
        normatividad.id_tipo_fk,
        normatividad.fecha,
        id
       ] 
    );
  
    let message = 'Error actualizando normatividad';
  
    if (result.affectedRows) {
      message = 'Registro de normatividad actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM normatividades WHERE id=?`, 
      [id]
    );
  
    let message = 'Error borrando normatividad';
  
    if (result.affectedRows) {
      message = 'Registro de normatividad borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}