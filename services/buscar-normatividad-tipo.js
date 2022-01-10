const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, tipo){
  const offset = helper.getOffset(page, config.listPerPage);
  let tipoNormatividad= '%'+tipo+'%';
  const rows = await db.query(
    `SELECT  concat(tn.nombre," ",n.nombre) as normatividad, n.contenido, n.url_descarga, n.fecha, tn.id_tipo as tipo_normatividad
     FROM tipos_normatividades as tn, normatividades n
     WHERE n.id_tipo_fk=tn.id_tipo and 
           tn.nombre like ?
    LIMIT ?,?`, 
    [tipoNormatividad, offset, config.listPerPage]
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