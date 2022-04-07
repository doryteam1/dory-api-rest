const db = require('./db');
const helper = require('../helper');
const config = require('../config');
/*--------------------- GetMunicipio X Id--------------------------------*/
async function getMunicipio(page = 1,id_municipio){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT m.id_municipio, m.nombre, m.descripcion, m.poblacion, id_departamento_fk,  
            (select d.nombre_departamento from departamentos d  where d.id_departamento=m.id_departamento_fk) as departamento, id_subregion_fk,
            (select subr.nombre from subregiones as subr  where subr.id_subregion=m.id_subregion_fk) as subregion,
            m.latitud, m.longitud
     FROM municipios as m
     WHERE m.id_municipio=?
     LIMIT ?,?`, 
    [id_municipio, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End GetMunicipio*/

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
  getMunicipio,
  getMultiple,
  create,
  update,
  remove
}