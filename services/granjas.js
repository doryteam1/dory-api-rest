const db = require('./db');
const helper = require('../helper');
const config = require('../config');
/*id del usuario- retornar todas las granjas de un usuario */



async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM granjas LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

/* granja, token de usuario,array de id de tipos de infraestructuras de la granja actualizarlos, array de id de especies cultivadas actualizarlas  */
async function create(granja){
     const result = await db.query(
      `INSERT INTO granjas (id_granja,nombre,area,numero_trabajadores, produccion_estimada_mes,direccion,latitud,longitud,descripcion,id_departamento,id_municipio,id_corregimiento,id_vereda) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        granja.id_granja,
        granja.nombre,
        granja.area,
        granja.numero_trabajadores,
        granja.produccion_estimada_mes,
        granja.direccion,
        granja.latitud,
        granja.longitud,
        granja.descripcion,
        granja.id_departamento,
        granja.id_municipio,
        granja.id_corregimiento,
        granja.id_vereda
      ]
    );
  
    let message = {message: 'Error creando la granja'};
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'Granja creada exitosamente'};
    }
  
    return message;
  }
  /*granja,id-granja a modificar, token de usuario,array de id de tipos de infraestructuras de la granja actualizarlos, array de id de especies cultivadas actualizarlas*/
  async function update(id, granja){
    const result = await db.query(
      `UPDATE granjas 
       SET nombre=?,
           area=? ,
           numero_trabajadores=?,
           produccion_estimada_mes=?,
           direccion=? ,
           latitud=? ,
           longitud=? ,
           descripcion=? ,
           id_departamento=? ,
           id_municipio=? ,
           id_corregimiento=? ,
           id_vereda=? 
       WHERE id_granja=?`,
       [
          granja.nombre,
          granja.area,
          granja.numero_trabajadores,
          granja.produccion_estimada_mes,
          granja.direccion,
          granja.latitud,
          granja.longitud,
          granja.descripcion,
          granja.id_departamento,
          granja.id_municipio,
          granja.id_corregimiento,
          granja.id_vereda,
          id
       ] 
    );
  
    let message = 'Error actualizando la granja';
  
    if (result.affectedRows) {
      message = 'Granja actualizada exitosamente';
    }
  
    return {message};
  }
  
  /*token de usuario recibirlo*/
  async function remove(id){
    const result = await db.query(
      `DELETE FROM granjas WHERE id_granja=?`, 
      [id]
    );
  
    let message = 'Error borrando granja';
  
    if (result.affectedRows) {
      message = 'granja borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}