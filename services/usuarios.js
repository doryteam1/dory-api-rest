const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt= require('bcrypt');
var createError = require('http-errors');
const res = require('express/lib/response');


async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT u.id, u.cedula,u.nombres, u.apellidos,u.celular,u.direccion,u.email,u.id_tipo_usuario,u.id_area_experticia,
            u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
            u.id_departamento,u.id_municipio,u.id_corregimiento,u.id_vereda,
            u.latitud,u.longitud,u.nombre_corregimiento,u.nombre_vereda,u.estaVerificado,u.otra_area_experticia,u.otra_area_experticia_descripcion,u.sobre_mi
     FROM usuarios as u 
     LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

/* ----------------------------------CREATE-----------------------------*/
async function create(usuario,google){
  
    if(!google){
        let message='Registro fallido';
        try {
          const saltRounds= 10;
          const salt= bcrypt.genSaltSync(saltRounds);//generate a salt
          const passwordHash= bcrypt.hashSync( usuario.password , salt);//generate a password Hash (salt+hash)
          usuario.password=passwordHash;//Re-assign hashed generate a salt version over original, plain text password 
          usuario.estaVerificado=0;   
        } catch  {
          throw createError(500,"Un problema al crear el usuario");
        }
          try{
            const result = await db.query(
              `INSERT INTO usuarios(cedula,nombres,apellidos,celular,direccion,id_tipo_usuario,email,password,id_area_experticia,nombre_negocio,foto,fecha_registro,fecha_nacimiento,id_departamento,id_municipio,id_corregimiento,id_vereda,latitud,longitud,estaVerificado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
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
                usuario.estaVerificado         
              ]
            );
            if (result.affectedRows) {
              message = 'Usuario registrado exitosamente';
              let mensaje="Bienvenido(a), "+usuario.nombres+" "+"estamos emocionados de que te hayas registrado con nosotros, somos un equipo conformado por emprendedores y profesionales que trabajan día a día para promover la productividad y competitividad de la cadena piscícola del Departamento de Sucre, en alianza con los grupos de investigación, Gestión de la Producción y la Calidad y GINTEING, de la Universidad de Sucre y la Corporación Universitaria Antonio José de Sucre.";
              let mensaje2="Solo falta que verifiques tu cuenta.   Haz click en el siguiente enlace para verificar tu correo electrónico";
              let token=helper.createToken(usuario,4320);/*token de 3 días*/
              let tema="Bienvenido a Dory";
              contentHtml = `<center>
              <img src="http://sharpyads.com/wp-content/uploads/2022/03/logo-no-name-320x320.png" width="100" height="100" />
              <h2 style='color:grey'>Bienvenido a la plataforma piscícola Dory</h2>
              <p style='color:grey; text-align:justify; margin-bottom:20px'>${mensaje}</p>
              <p style='color:grey; text-align:justify; margin-bottom:20px'>${mensaje2}</p> 
              <form>
              <a href="https://dory-web-app-tests.herokuapp.com/verify-account?token=${token}" style=" color:#ffffff; text-decoration:none;  border-radius:20px; border: 1px solid #19A3A6; background-color:#19A3A6; font-family:Arial,Helvetica,sans-serif; width: 205px;     margin-top: 20px; height: fit-content; padding:5px 40px; font-weight:normal;  font-size:12px;">Verificar cuenta de usuario </a></form>
              </center>
              </br>
              `;
              helper.sendEmail(usuario.email,tema,contentHtml);
            }else {
              throw createError(500,"Ocurrió un problema al registrar un usuario");
            }

          }catch(err){
              throw err;
          }
          return {message};
        }else{
           return "Usuario registrado con google";
        }
  }/*End create*/

/* ----------------------------------UPDATE-----------------------------*/

  async function update(id, usuario){
      
      if (usuario.cedula!= undefined && 
        usuario.nombres!= undefined  && 
        usuario.apellidos!= undefined  &&
        usuario.celular!= undefined  &&
        usuario.direccion!= undefined  && 
        usuario.id_tipo_usuario!= undefined  &&
        usuario.email!= undefined  &&
        usuario.id_area_experticia!= undefined  &&
        usuario.nombre_negocio!= undefined  &&
        usuario.foto!= undefined  && 
        usuario.fecha_registro!= undefined  &&
        usuario.fecha_nacimiento!= undefined  &&
        usuario.id_departamento!= undefined &&
        usuario.id_municipio!= undefined  &&
        usuario.id_corregimiento!= undefined  &&
        usuario.id_vereda!= undefined  &&
        usuario.latitud!= undefined  &&
        usuario.longitud!= undefined ){

      const result = await db.query(
      `UPDATE usuarios
       SET  cedula=?,
            nombres=?, 
            apellidos=?,
            celular=?,
            direccion=?, 
            id_tipo_usuario=?,
            email=?,
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
    
      let message = 'Usuario no esta registrado';
    
      if (result.affectedRows) {
        message = 'Usuario actualizado exitosamente';
      }
    
      return {message};
    }  
        throw createError(400,"Un problema con los parametros ingresados al actualizar"); 
       
  }/*fin update*/

  
  /* ----------------------------------REMOVE-----------------------------*/

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

/* ----------------------------------UPDATE PARCIAL DEL USUARIO-----------------------------*/

  async function updateParcialUsuario(id, usuario){
  
   delete usuario.password; 
   var atributos=Object.keys(usuario); /*Arreglo de los keys del usuario*/ 
 
   if (atributos.length!=0){
     
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

    throw createError(400,"No hay parametros para actualizar");

  }

module.exports = {
  getMultiple,
  create,
  update,
  remove,
  updateParcialUsuario
}


   
    
