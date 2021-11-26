const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,(SELECT count(*) FROM municipios m1, granjas g1 where m1.id_municipio=g1.id_municipio and m1.id_municipio=m.id_municipio) as count_granjas
     FROM  granjas g, municipios m, corregimientos c,veredas v
     WHERE  m.id_municipio=g.id_municipio or
      c.id_municipio=g.id_corregimiento or
      v.id_municipio=g.id_municipio LIMIT ?,?`, 
    [offset, config.listPerPage]
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