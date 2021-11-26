const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM municipios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(municipio){
    const result = await db.query(
      `INSERT INTO municipios(id_municipio, nombre,descripcion,poblacion,id_departamento_fk,id_subregion_fk) VALUES (?,?,?,?,?,?)`, 
      [
        municipio.id_municipio,
        municipio.nombre,
        municipio.descripcion,
        municipio.poblacion,
        municipio.id_departamento_fk,
        municipio.id_subregion_fk
      ]
    );
  
    let message = 'Error creando municipio';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'municipio creado exitosamente'};
    }
  
    return {message};
  }

  async function update(id, municipio){
    const result = await db.query(
      `UPDATE municipios 
       SET nombre=?,
           descripcion=?,
           poblacion=?,
           id_departamento_fk=?, 
           id_subregion_fk=?
       WHERE id_municipio=?`,
       [
         municipio.nombre,
         municipio.descripcion, 
         municipio.poblacion,
         municipio.id_departamento_fk,
         municipio.id_subregion_fk,
         id
       ] 
    );
  
    let message = 'Error actualizando municipio';
  
    if (result.affectedRows) {
      message = 'municipio actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM municipios WHERE id_municipio=?`, 
      [id]
    );
  
    let message = 'Error borrando municipio';
  
    if (result.affectedRows) {
      message = 'municipio borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}