const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,
    (SELECT count(*) 
     FROM municipios m1, usuarios u1, tipos_usuarios tu 
     WHERE m1.id_municipio=u1.id_municipio and  m1.id_municipio=m.id_municipio and 
     u1.id_tipo_usuario=tu.id_tipo_usuario and tu.nombre_tipo_usuario like('Piscicultor')) as count_piscicultores
FROM  usuarios u, municipios m, corregimientos c,veredas v, departamentos d
WHERE ( m.id_departamento_fk=d.id_departamento) and 
(m.id_municipio=u.id_municipio or c.id_municipio=u.id_municipio or v.id_municipio=u.id_municipio)  and
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