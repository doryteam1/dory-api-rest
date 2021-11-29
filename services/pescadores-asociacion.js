const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,nit){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow   * 
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