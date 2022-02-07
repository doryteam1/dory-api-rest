const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, cadena){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  const rows = await db.query(
    `SELECT  te.nombre as tipo,e.nombre as nombre,e.url, e.resumen, e.fecha, e.hora, e.dirigidoa, e.organizador, e.costo, e.imagen
    FROM tipos_eventos as te, eventos as e
    WHERE (e.id_tipo_evento_fk=te.id_evento) and 
          (te.nombre like '%Diplomados%') and
          (e.nombre like ? or e.resumen like ?)
    LIMIT ?,?`, 
    [cad, cad, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


module.exports = {
  getMultiple
}