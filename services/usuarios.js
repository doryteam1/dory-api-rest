const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt= require('bcrypt');

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
  console.log("data ",usuario)
  try {
    const salt= await bcrypt.genSalt(10);//generate a salt
    const passwordHash= await bcrypt.hash( usuario.password , salt);//generate a password Hash (salt+hash)
    usuario.password=passwordHash;//Re-assign hashed generate a salt version over original, plain text password
  } catch (error) {
    return (error);
  }

    const result = await db.query(
      `INSERT INTO usuarios(id,cedula,nombres,apellidos,celular,direccion,id_tipo_usuario,email,password,id_area_experticia,nombre_negocio,foto,fecha_registro,fecha_nacimiento,id_departamento,id_municipio,id_corregimiento,id_vereda,latitud,longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
      [
        usuario.id,
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

  async function update(id, usuario){
    const result = await db.query(
      `UPDATE usuarios
       SET  cedula=?
            nombres=?, 
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
       WHERE id=?`,
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
        usuario.longitud,
        id
       ] 
    );
  
    let message = 'Error actualizando el registro del usuario';
  
    if (result.affectedRows) {
      message = 'Usuario actualizado exitosamente';
    }
  
    return {message};
  }
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM usuarios WHERE id=?`, 
      [id]
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