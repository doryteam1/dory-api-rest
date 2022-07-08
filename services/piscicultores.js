const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');

async function getPiscicultoresMunicipio(page = 1,idMunicipio){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
 `SELECT distinctrow   tu.id_tipo_usuario,tu.nombre_tipo_usuario as tipo_usuario,u.id,u.cedula,concat(u.nombres," ",u.apellidos) as nombre,
    u.celular,u.direccion,u.email,u.id_area_experticia,
    (select a.nombre from areas_experticias a  where a.id_area=u.id_area_experticia) as area_experticia,u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
    (select d.nombre_departamento from departamentos d  where d.id_departamento=u.id_departamento) as departamento,
    (select m.nombre from municipios as m  where m.id_municipio=u.id_municipio) as municipio,
    (select c.nombre from corregimientos as c  where c.id_corregimiento=u.id_corregimiento) as corregimiento,
    (select v.nombre from veredas as v  where v.id_vereda=u.id_vereda) as vereda,
    u.latitud,u.longitud
 FROM tipos_usuarios as tu, usuarios as u
 WHERE (u.id_tipo_usuario=tu.id_tipo_usuario) and (tu.nombre_tipo_usuario like('Piscicultor')) and 
       u.id_municipio=?
           LIMIT ?,?`, 
    [idMunicipio,offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}/*End getPiscicultoresMunicipio*/

async function getPiscicultoresDepartamento(page = 1, idDepartamento){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow  m.id_municipio, m.nombre, m.poblacion,
    (SELECT count(*) 
     FROM municipios m1, usuarios u1, tipos_usuarios tu 
     WHERE m1.id_municipio=u1.id_municipio and  m1.id_municipio=m.id_municipio and 
     u1.id_tipo_usuario=tu.id_tipo_usuario and tu.nombre_tipo_usuario like('Piscicultor')) as count_piscicultores
FROM  usuarios as u, municipios as m, corregimientos as c,veredas as v, departamentos as d
WHERE ( m.id_departamento_fk=d.id_departamento) and 
(m.id_municipio=u.id_municipio or c.id_municipio=u.id_municipio or v.id_municipio=u.id_municipio)  and
d.id_departamento=?
 LIMIT ?,?`, 
    [idDepartamento, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}/*End getPiscicultoresDepartamento*/

async function getPiscicultoresAsociacion(page = 1,nit){
        const valid_rows = await db.query(
          `SELECT  *
          FROM asociaciones as a
          WHERE  a.nit=?
          `, 
          [nit]
        );
        if(valid_rows.length<1){
            throw createError(404,"La asociación ingresada no existe"); 
        }
        const offset = helper.getOffset(page, config.listPerPage);
        const rows = await db.query(
          `SELECT  tu.id_tipo_usuario,tu.nombre_tipo_usuario as tipo_usuario,u.cedula,concat(u.nombres," ",u.apellidos) as nombre,
                  u.celular,u.direccion,u.email,u.id_area_experticia,
                  (select a.nombre from areas_experticias a  where a.id_area=u.id_area_experticia) as area_experticia,u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
                  (select d.nombre_departamento from departamentos d  where d.id_departamento=u.id_departamento) as departamento,
                  (select m.nombre from municipios as m  where m.id_municipio=u.id_municipio) as municipio,
                  (select c.nombre from corregimientos as c  where c.id_corregimiento=u.id_corregimiento) as corregimiento,
                  (select v.nombre from veredas as v  where v.id_vereda=u.id_vereda) as vereda,
                  u.latitud,u.longitud, a.nit as nit_asociacion, a.nombre as nombre_asociacion,
                  a.legalconstituida, a.fecha_renovacion_camarac, a.foto_camarac, a.id_tipo_asociacion_fk as id_tipo_asociacion,
                  (select ta.nombre from tipos_asociaciones as ta  where ta.id_tipo_asociacion=a.id_tipo_asociacion_fk) as tipo_asociacion 
          FROM tipos_usuarios tu,usuarios u,asociaciones_usuarios asu,asociaciones a
          WHERE (u.id_tipo_usuario=tu.id_tipo_usuario) and (tu.nombre_tipo_usuario like('Piscicultor') ) and 
                  (u.id=asu.usuarios_id) and  (a.nit=asu.nit_asociacion_pk_fk) and a.nit=?
                  LIMIT ?,?`, 
          [nit,offset, config.listPerPage]
        );

        const rowsmiembros = await db.query(
          `SELECT DISTINCT   tu.id_tipo_usuario, tu.nombre_tipo_usuario as tipo_usuario,u.cedula,concat(u.nombres," ",u.apellidos) as nombre,
                              u.celular,u.direccion,u.email,u.id_area_experticia,
                              (select a.nombre from areas_experticias a  where a.id_area=u.id_area_experticia) as area_experticia,
                              u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
                              (select d.nombre_departamento from departamentos d  where d.id_departamento=u.id_departamento) as departamento,
                              (select m.nombre from municipios as m  where m.id_municipio=u.id_municipio) as municipio,
                              (select c.nombre from corregimientos as c  where c.id_corregimiento=u.id_corregimiento) as corregimiento,
                              (select v.nombre from veredas as v  where v.id_vereda=u.id_vereda) as vereda,
                              u.latitud,u.longitud, a.nit as nit_asociacion, a.nombre as nombre_asociacion,
                              a.legalconstituida, a.fecha_renovacion_camarac, a.foto_camarac, a.id_tipo_asociacion_fk as id_tipo_asociacion,
                              (select ta.nombre from tipos_asociaciones as ta  where ta.id_tipo_asociacion=a.id_tipo_asociacion_fk) as tipo_asociacion 
          FROM tipos_usuarios tu,usuarios u,asociaciones as a, solicitudes as s, estados_solicitudes as e
          WHERE (u.id_tipo_usuario=tu.id_tipo_usuario) and (tu.nombre_tipo_usuario like('Piscicultor') ) and 
          (u.id=s.usuarios_id_fk) and (a.nit=s.nit_asociacion_fk) and (s.id_estado_fk=2) and a.nit=?
                  LIMIT ?,?`, 
          [nit,offset, config.listPerPage]
        );
        var nuevoRows = new Array();        
        nuevoRows.push(rows[0]);  
        rowsmiembros.forEach((element)=>{ 
          nuevoRows.push(element);          
        });
        const row = await db.query(
          `select m.nombre 
          from asociaciones as a inner join municipios as m on a.id_municipio = m.id_municipio 
          where a.nit = ?`,
          [nit]
          );
        const municipio = row[0].nombre;
        let data = helper.emptyOrRows(nuevoRows);
        const meta = {page};
        return {
          data,
          municipio,
          meta
        }
}/*End getPiscicultoresAsociacion*/

module.exports = {
  getPiscicultoresMunicipio,
  getPiscicultoresDepartamento,
  getPiscicultoresAsociacion
}