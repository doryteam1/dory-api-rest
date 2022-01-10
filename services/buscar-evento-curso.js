const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, cadena){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  const rows = await db.query(
    `SELECT  te.nombre as tipo_evento,e.nombre as nombre_curso, e.resumen, e.fecha, e.dirigidoa, e.organizador, e.costo
    FROM tipos_eventos as te, eventos as e
    WHERE (e.id_tipo_evento_fk=te.id_evento) and 
          (te.nombre like '%Cursos%') and
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