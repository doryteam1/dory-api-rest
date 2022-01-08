const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, tipo){
  const offset = helper.getOffset(page, config.listPerPage);
  let tipoEvento= '%'+tipo+'%';
  const rows = await db.query(
    `SELECT  te.nombre,e.nombre as evento, e.resumen, e.fecha, e.dirigidoa, e.organizador, e.costo
    FROM tipos_eventos as te, eventos as e
    WHERE e.id_tipo_evento_fk=te.id_evento and 
          te.nombre like ?
    LIMIT ?,?`, 
    [tipoEvento, offset, config.listPerPage]
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