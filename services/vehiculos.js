const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM vehiculos LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(vehiculo){
     const result = await db.query(
      `INSERT INTO vehiculos (id_vehiculo,capacidad,modelo,transporte_alimento,usuarios_id) VALUES (?,?,?,?,?)`, 
      [
        vehiculo.id_vehiculo,
        vehiculo.capacidad,
        vehiculo.modelo,
        vehiculo.transporte_alimento,
        vehiculo.usuarios_id
      ]
    );
  
    let message = {message: 'Error creando vehiculo'};
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'vehiculo creado exitosamente'};
    }
  
    return message;
  }

  async function update(token, vehiculo){
     let id;
    const result = await db.query(
      `UPDATE vehiculos 
       SET capacidad=?,
           modelo=?,
           transporte_alimento=?,
           usuarios_id=?
       WHERE id_vehiculo=?`,
       [
            vehiculo.capacidad,
            vehiculo.modelo,
            vehiculo.transporte_alimento,
            vehiculo.usuarios_id,
            id
       ] 
    );
  
    let message = 'Error actualizando vehiculo';
  
    if (result.affectedRows) {
      message = 'vehiculo actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id_vehiculo,token){
    let id_user;
    const result = await db.query(
      `DELETE FROM vehiculos WHERE id_vehiculo=? and usuarios_id=id_user`, 
      [id_vehiculo]
    );
  
    let message = 'Error borrando vehiculo';
  
    if (result.affectedRows) {
      message = 'vehiculo borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}