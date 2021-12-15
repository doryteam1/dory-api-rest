const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT m.id_municipio, m.nombre
    FROM municipios as m, departamentos as d
    WHERE (m.id_departamento_fk=d.id_departamento)  and
          d.id_departamento=? LIMIT ?,?`, 
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