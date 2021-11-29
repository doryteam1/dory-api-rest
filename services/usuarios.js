const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM usuarios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}


async function create(usuario){
    const result = await db.query(
      `INSERT INTO usuarios(cedula,nombres,apellidos,celular,direccion,id_tipo_usuario,email,password,id_area_experticia,nombre_negocio,foto,fecha_registro,fecha_nacimiento,id_departamento,id_municipio,id_corregimiento,id_vereda,latitud,longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        usuario.cedula,
        usuario.nombres, 
        usuario.apellidos,
        usuario.celular,
        usuario.direccion, 
        usuario.id_tipo_usuario,
        usuario.email,
        usuario.password, 
        usuario.id_area_experticia,
        usuario.nombre_negocio,
        usuario.foto, 
        usuario.fecha_registro,
        usuario.fecha_nacimiento,
        usuario.id_departamento,
        usuario.id_municipio,
        usuario.id_corregimiento,
        usuario.id_vereda,
        usuario.latitud,
        usuario.longitud
      ]
    );
  
    let message = 'Error al registrar usuario';
  
    if (result.affectedRows) {
      message = 'Usuario registrado exitosamente';
    }
  
    return {message};
  }

  async function update(cedula, usuario){
    const result = await db.query(
      `UPDATE usuarios
       SET  nombres=?, 
            apellidos=?,
            celular=?,
            direccion=?, 
            id_tipo_usuario=?,
            email=?,
            password=?, 
            id_area_experticia=?,
            nombre_negocio=?,
            foto=?, 
            fecha_registro=?,
            fecha_nacimiento=?,
            id_departamento=?,
            id_municipio=?,
            id_corregimiento=?,
            id_vereda=?,
            latitud=?,
            longitud=?
       WHERE cedula=?`,
       [
        usuario.nombres, 
        usuario.apellidos,
        usuario.celular,
        usuario.direccion, 
        usuario.id_tipo_usuario,
        usuario.email,
        usuario.password, 
        usuario.id_area_experticia,
        usuario.nombre_negocio,
        usuario.foto, 
        usuario.fecha_registro,
        usuario.fecha_nacimiento,
        usuario.id_departamento,
        usuario.id_municipio,
        usuario.id_corregimiento,
        usuario.id_vereda,
        usuario.latitud,
        usuario.longitud,
        cedula
       ] 
    );
  
    let message = 'Error actualizando el registro del usuario';
  
    if (result.affectedRows) {
      message = 'Usuario actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(cedula){
    const result = await db.query(
      `DELETE FROM usuarios WHERE cedula=?`, 
      [cedula]
    );
  
    let message = 'Error borrando el registro del usuario';
  
    if (result.affectedRows) {
      message = 'Usuario borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}