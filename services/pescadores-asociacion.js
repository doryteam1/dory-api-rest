const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,nit){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow   tu.id_tipo_usuario,tu.nombre_tipo_usuario as tipo_usuario,u.cedula,concat(u.nombres," ",u.apellidos) as nombre,
                          u.celular,u.direccion,u.email,u.password,u.id_area_experticia,
                          (select a.nombre from areas_experticias a  where a.id_area=u.id_area_experticia) as area_experticia,u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
                          (select d.nombre_departamento from departamentos d  where d.id_departamento=u.id_departamento) as departamento,
                          (select m.nombre from municipios as m  where m.id_municipio=u.id_municipio) as municipio,
                          (select c.nombre from corregimientos as c  where c.id_corregimiento=u.id_corregimiento) as corregimiento,
                          (select v.nombre from veredas as v  where v.id_vereda=u.id_vereda) as vereda,
                          u.latitud,u.longitud, a.nit as nit_asociación, a.nombre as nombre_asociación,
                          a.legalconstituida, a.fecha_renovacion_camarac, a.foto_camarac, a.id_tipo_asociacion_fk as id_tipo_asociación,
                          (select ta.nombre from tipos_asociaciones as ta  where ta.id_tipo_asociacion=a.id_tipo_asociacion_fk) as tipo_asociación
     FROM tipos_usuarios tu,usuarios u,asociaciones_usuarios asu,asociaciones a
     WHERE (u.id_tipo_usuario=tu.id_tipo_usuario) and (tu.nombre_tipo_usuario like('Pescador') ) and 
     (u.cedula=asu.cedula_usuario_pk_fk) and  (a.nit=asu.nit_asociacion_pk_fk) and a.nit=?
           LIMIT ?,?`, 
    [nit,offset, config.listPerPage]
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