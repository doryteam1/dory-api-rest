const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,idDepartamento){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT m.id_municipio, m.nombre, m.poblacion, m.latitud, m.longitud,
            (SELECT count(*) FROM municipios m1, usuarios u1, tipos_usuarios tu  WHERE m1.id_municipio=u1.id_municipio and  m1.id_municipio=m.id_municipio and u1.id_tipo_usuario=tu.id_tipo_usuario and tu.nombre_tipo_usuario like('Pescador')) as count_pescadores,
            (SELECT count(*) FROM municipios m1, usuarios u1, tipos_usuarios tu  WHERE m1.id_municipio=u1.id_municipio and  m1.id_municipio=m.id_municipio and u1.id_tipo_usuario=tu.id_tipo_usuario and tu.nombre_tipo_usuario like('Piscicultor')) as count_piscicultores,
            (SELECT count(*) FROM municipios m1, asociaciones a1 WHERE m1.id_municipio=a1.id_municipio and  m1.id_municipio=m.id_municipio ) as count_asociaciones
    FROM municipios as m, departamentos as d
    WHERE (m.id_departamento_fk=d.id_departamento)  and
          d.id_departamento=? LIMIT ?,?`, 
    [idDepartamento, offset, config.listPerPage]
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