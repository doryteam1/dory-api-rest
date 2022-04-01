const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getGranjaUsuario(page = 1,id_user){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * 
     FROM granjas as g, usuarios as u, usuarios_granjas as ug
     WHERE u.id=? and ug.usuarios_id=? and ug.espropietario=1 and g.id_granja=ug.id_granja_pk_fk
     LIMIT ?,?`, 
    [id_user, id_user, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}/*End getGranjaUsuario*/


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
}/*End GetMultiple*/

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
  }/*End Create*/
  /*granja,id-granja a modificar, token de usuario,array de id de tipos de infraestructuras de la granja actualizarlos, array de id de especies cultivadas actualizarlas*/
  async function update(idGranja, granja){
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
          idGranja
       ] 
    );
  
    let message = 'Error actualizando la granja';
  
    if (result.affectedRows) {
      message = 'Granja actualizada exitosamente';
    }
  
    return {message};
  }/*End Update*/
  
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
  }/*End Remove*/

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  getGranjaUsuario
}