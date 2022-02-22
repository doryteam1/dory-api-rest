const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const bcrypt= require('bcrypt');
const jwt = require("jwt-simple");
var moment = require("moment");

async function getMultiple(page = 1, id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow   u.cedula,concat(u.nombres," ",u.apellidos) as nombre_completo,
    u.celular,u.direccion,u.email,u.password,tu.id_tipo_usuario,tu.nombre_tipo_usuario as tipo_usuario,u.id_area_experticia,
    (select a.nombre from areas_experticias a  where a.id_area=u.id_area_experticia) as area_experticia,u.nombre_negocio,u.foto,u.fecha_registro,u.fecha_nacimiento,
    (select d.nombre_departamento from departamentos d  where d.id_departamento=u.id_departamento) as departamento,
    (select m.nombre from municipios as m  where m.id_municipio=u.id_municipio) as municipio,
    (select c.nombre from corregimientos as c  where c.id_corregimiento=u.id_corregimiento) as corregimiento,
    (select v.nombre from veredas as v  where v.id_vereda=u.id_vereda) as vereda,
    u.latitud,u.longitud,u.nombre_corregimiento,u.nombre_vereda
 FROM tipos_usuarios as tu, usuarios as u
 WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
       u.id=?
    LIMIT ?,?`, 
    [id, offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function updatePassword(datos){

  const{email,newPassword,}=datos;
  let message = 'Error al actualizar Password de usuario';
  
  if(email!=undefined && newPassword!=undefined)
   {   

     try { 
      const saltRounds= 10;
      const salt= bcrypt.genSaltSync(saltRounds);//generate a salt 
      const passwordHash= bcrypt.hashSync( newPassword , salt);//generate a password Hash (salt+hash)
      
      const result = await db.query(
        `UPDATE usuarios
         SET password=?
         WHERE email=?`,
         [
          passwordHash,
          email
         ] 
      );
       
      if (result.affectedRows) {
        message = 'Contraseña de Usuario actualizado exitosamente';
      }

      /*--------verificación <---payload del token tenga el mismo email del usuario--------*/
        
      const userbd = await db.query(
        `SELECT *
         FROM usuarios
         WHERE email=?`,
         [
          email
         ] 
      );

      
      /*-----------------------------------------------------------------------------------*/

        var payload = {
        email:userbd[0].email,
        sub: userbd[0].id,
        rol: userbd[0].id_tipo_usuario,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
      };
      console.log('payload'+' ',payload);


      /*-----------------------------------------------------------------------------------*/

      } catch {
               throw createError(500,"Problema al actualizar password del usuario");
             }
         
         return {message};
   }     
      throw createError(400,"Email y Password requeridos!"); 
}


module.exports = {
  getMultiple,
  updatePassword
}