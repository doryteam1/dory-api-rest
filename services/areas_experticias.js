const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAreasExperticia(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM areas_experticias LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}

async function create(area_experticia){
    const result = await db.query(
      `INSERT INTO areas_experticias(id_area,nombre,descripcion) VALUES (?,?,?)`, 
      [
        area_experticia.id_area,
        area_experticia.nombre, 
        area_experticia.descripcion
      ]
    );  
    let message = 'Error creando Area de Experticia';  
    if (result.affectedRows) {
      message = 'Area de Experticia creada exitosamente';
    }  
    return {message};
  }

  async function update(id, area_experticia){
    const result = await db.query(
      `UPDATE areas_experticias
       SET nombre=?,
           descripcion=? 
       WHERE id_area=?`,
       [
         area_experticia.nombre, 
         area_experticia.descripcion,
         id
       ] 
    );
  
    let message = 'Error actualizando Area de Experticia';  
    if (result.affectedRows) {
      message = 'Area de experticia actualizada exitosamente';
    }  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM areas_experticias WHERE id_area=?`, 
      [id]
    );  
    let message = 'Error borrando Area de Experticia';  
    if (result.affectedRows) {
      message = 'Area de Experticia borrada exitosamente';
    }  
    return {message};
  }

module.exports = {
  getAreasExperticia,
  create,
  update,
  remove
}