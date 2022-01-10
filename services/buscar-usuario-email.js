const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, email){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT  u.cedula,concat(u.nombres," ",u.apellidos) as nombre_completo,
    u.celular,u.direccion,u.email,u.password,tu.id_tipo_usuario,tu.nombre_tipo_usuario as tipo_usuario,u.id_area_experticia,
    
    u.latitud,u.longitud
    FROM usuarios as u inner join tipos_usuarios as tu on u.id_tipo_usuario=tu.id_tipo_usuario
    WHERE   u.email=?
    LIMIT ?,?`, 
    [email, offset, config.listPerPage]
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