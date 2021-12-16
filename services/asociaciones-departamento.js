const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
`SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,
    (SELECT count(*) 
     FROM municipios m1, asociaciones a1
     WHERE m1.id_municipio=a1.id_municipio and  m1.id_municipio=m.id_municipio ) as count_asociaciones
FROM  asociaciones as a, municipios as m, corregimientos as c,veredas as v, departamentos as d
WHERE ( m.id_departamento_fk=d.id_departamento) and 
(m.id_municipio=a.id_municipio or c.id_municipio=a.id_municipio or v.id_municipio=a.id_municipio)  and
d.id_departamento=?
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