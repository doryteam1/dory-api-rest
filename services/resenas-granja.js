const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinct r.id_reseña, r.descripcion, r.fecha, r.usuarios_id as id_usuario, r.id_granja_pk_fk as id_granja, g.nombre as nombre_granja
    FROM reseñas as r, granjas as g, usuarios_granjas as ug
    WHERE r.id_granja_pk_fk=g.id_granja and 
          g.id_granja=ug.id_granja_pk_fk and
          g.id_granja=?
           LIMIT ?,?`, 
    [id,offset, config.listPerPage]
  );

  const rowspuntajes = await db.query(
    `SELECT distinct   avg(ug.puntuacion) as puntaje
    FROM  granjas as g, usuarios_granjas as ug
    WHERE g.id_granja=ug.id_granja_pk_fk and
          g.id_granja=?
           LIMIT ?,?`, 
    [id,offset, config.listPerPage]
  );

  var nuevoRows = new Array();
  nuevoRows.push(rows,rowspuntajes[0]);
  
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }
}
 
module.exports = {
  getMultiple
}