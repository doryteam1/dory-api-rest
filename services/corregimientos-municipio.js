const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT c.id_corregimiento, c.nombre, c.descripcion
    FROM municipios as m, corregimientos as c
    WHERE (m.id_municipio=c.id_municipio)  and
          c.id_municipio=? 
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