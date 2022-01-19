const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt= require('bcrypt');
var createError = require('http-errors');
const res = require('express/lib/response');

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
  let message='';
  console.log("Registrando usuario...");
  console.log(usuario);
  try {
    const salt= await bcrypt.genSalt(10);//generate a salt
    const passwordHash= await bcrypt.hash( usuario.password , salt);//generate a password Hash (salt+hash)
    usuario.password=passwordHash;//Re-assign hashed generate a salt version over original, plain text password
  } catch (error) {
    return (error);
  }

    try{
      const result = await db.query(
        `INSERT INTO usuarios(cedula,nombres,apellidos,celular,direccion,id_tipo_usuario,email,password,id_area_experticia,nombre_negocio,foto,fecha_registro,fecha_nacimiento,id_departamento,id_municipio,id_corregimiento,id_vereda,latitud,longitud,nombre_corregimiento,nombre_vereda) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
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
          usuario.nombre_corregimiento,
          usuario.nombre_vereda
        ]
      );
      if (result.affectedRows) {
        message = 'Usuario registrado exitosamente';
      }
    }catch(err){
      console.log("err query: ",err);
      if(err.code == 'ER_DUP_ENTRY'){
        throw createError(500, 'El email ingresado ya existe');
      }
      message = 'Error al registrar usuario';
    }
  
    return {message};
  }

  async function update(id, usuario){
    const result = await db.query(
      `UPDATE usuarios
       SET  cedula=?,
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
            longitud=?,
            nombre_corregimiento=?,
            nombre_vereda=?
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
        usuario.nombre_corregimiento,
        usuario.nombre_vereda,
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


  async function updateParcialUsuario(id, usuario){
   console.log("user id: ",id);
   console.log("data user: ",usuario)
   
   var atributos=Object.keys(usuario); /*Arreglo de los keys del usuario*/ 
   var param=Object.values(usuario);
   var query = "UPDATE usuarios SET ";
   param.push(id);/*Agrego el id al final de los parametros*/ 

   for(var i=0; i<atributos.length;i++) {
     query= query+atributos[i]+'=?,';
   }
   query= query.substring(0, query.length-1);/*eliminar la coma final*/ 
   query= query+' '+'WHERE id=?'

   const result = await db.query(query,param);
  
   let message = 'Error actualizando el registro del usuario';
  
    if (result.affectedRows) {
      message = 'Usuario actualizado exitosamente';
    }
 
    return {message};

  }

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  updateParcialUsuario
}


   
    
