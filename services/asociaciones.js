const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAsociacionesDepartamento(page = 1, idDepartamento){
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
          [idDepartamento, offset, config.listPerPage]
     );
        const data = helper.emptyOrRows(rows);
        const meta = {page};
        return {
          data,
          meta
        }
}//*End GetAsociacionesDepartamento*/

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM asociaciones LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(asociacion){
    const result = await db.query(
      `INSERT INTO asociaciones(nit, nombre,direccion,legalconstituida,fecha_renovacion_camarac,foto_camarac,id_tipo_asociacion_fk,id_departamento,id_municipio,id_corregimiento,id_vereda) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        asociacion.nit,
        asociacion.nombre,
        asociacion.direccion,
        asociacion.legalconstituida,
        asociacion.fecha_renovacion_camarac,
        asociacion.foto_camarac,
        asociacion.id_tipo_asociacion_fk,
        asociacion.id_departamento,
        asociacion.id_municipio,
        asociacion.id_corregimiento,
        asociacion.id_vereda
      ]
    );
  
    let message = 'Error creando asociacion';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'asociacion creada exitosamente'};
    }
  
    return {message};
  }

  async function update(nit, asociacion){
    const result = await db.query(
      `UPDATE asociaciones 
       SET nombre=?,
           direccion=?,
           legalconstituida=?,
           fecha_renovacion_camarac=?,
           foto_camarac=?,
           id_tipo_asociacion_fk=?,
           id_departamento=?, 
           id_municipio=?,
           id_corregimiento=?,
           id_vereda=?
       WHERE nit=?`,
       [
        asociacion.nombre,
        asociacion.direccion,
        asociacion.legalconstituida,
        asociacion.fecha_renovacion_camarac,
        asociacion.foto_camarac,
        asociacion.id_tipo_asociacion_fk,
        asociacion.id_departamento,
        asociacion.id_municipio,
        asociacion.id_corregimiento,
        asociacion.id_vereda,
        nit
       ] 
    );
  
    let message = 'Error actualizando asociación';
  
    if (result.affectedRows) {
      message = 'Asociacion actualizada exitosamente';
    }
  
    return {message};
  }
  
  async function remove(nit){
    const result = await db.query(
      `DELETE FROM asociaciones WHERE nit=?`, 
      [nit]
    );
  
    let message = 'Error borrando asociacion';
  
    if (result.affectedRows) {
      message = 'Asociación borrada exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getAsociacionesDepartamento,
  getMultiple,
  create,
  update,
  remove
}