const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, cadena){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  const rows = await db.query(
    `SELECT distinct e.id_evento, e.nombre as nombre,e.url, e.resumen, e.fecha, e.hora, e.dirigidoa, e.organizador, e.costo, e.imagen, te.nombre as tipo
    FROM eventos as e inner join tipos_eventos as te  
                 on ((te.nombre like '%Capacitaciones%') and (e.id_tipo_evento_fk=te.id_evento))  and                                            
                     (e.nombre like ? or e.resumen like ? or e.organizador like ? or e.dirigidoa like ?) 
                     LIMIT ?,?`, 
    [cad, cad, cad, cad, offset, config.listPerPage]
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