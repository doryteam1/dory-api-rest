const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT v.id_vereda, v.nombre, v.descripcion
    FROM municipios as m, veredas as v
    WHERE (m.id_municipio=v.id_municipio)  and
          v.id_municipio=? 
          LIMIT ?,?`, 
    [id, offset, config.listPerPage]
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