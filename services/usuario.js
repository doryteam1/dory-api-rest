const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const bcrypt= require('bcrypt');
const jwt = require("jwt-simple");
var moment = require("moment");
const nodemailer = require('nodemailer');

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
}//End getMultiple


 /*-------------------------------------updatePassword---------------------------------*/  

async function updatePassword(datos){

  const{newPassword,token,}=datos;
  let message = 'Error al actualizar Password de usuario';
  const payload=helper.parseJwt(token);/*--saco la carga útil del token para averiguar el email del usuario----*/  
  const email=payload.email;
  
  if(email!=undefined && newPassword!=undefined)
   {   
     try{ 
          const saltRounds= 10;
          const salt= bcrypt.genSaltSync(saltRounds);//generate a salt 
          const passwordHash= bcrypt.hashSync( newPassword , salt);//generate a password Hash (salt+hash)
          
           /*--------verificación de existencia de usuario--------*/                  
            const userbd = await db.query(
              `SELECT u.password,u.email,u.id,tu.nombre_tipo_usuario
              FROM usuarios as u, tipos_usuarios as tu
              WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
                    u.email=? 
              `, 
              [email]
            );
         
          if((userbd[0].email==undefined))
          {
              return {message};
          }
        /*--------Actualización del password de usuario--------*/
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
          
     } catch {
                  throw createError(500,"Actualización de password de usuario fallída");
             }
            
            return {message};
   }     
      throw createError(400,"Email y Password requeridos!"); 
}//End updatePassword


/*-------------------------------------recoverPassword---------------------------------*/  

async function recoverPassword(datos){

    const{email,}=datos;   

     if(email){
      
          const userbd = await db.query(
            `SELECT u.password,u.email,u.id,tu.nombre_tipo_usuario
            FROM usuarios as u, tipos_usuarios as tu
            WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
                  u.email=? 
            `, 
            [email]
          );

          if(userbd[0]){

                  const token=helper.createToken(userbd[0]);
                // console.log(token);
                  const mensaje="Hola, Nos acabas de informar que no recuerdas tu contraseña. Para volver a acceder a tu cuenta, haz click en actualizar contraseña."
            
                  /*-----------problemas con la imagen ?????---------------------------------*/ 
                  contentHtml = `<center> 
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUzOCIgaGVpZ2h0PSIxNTM4IiB2aWV3Qm94PSIwIDAgMTUzOCAxNTM4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTA0OS41MyA0OTguMjA3QzEwMTkuNTkgNDkxLjMzOCA5ODQuMjE3IDUyMS41ODUgOTgyLjI2OSA1NDEuOTg5QzExOTAuMzEgNzI1LjYyNiAxMTk2LjY3IDkyNS44NzQgMTE3Ni44OCAxMDQ2Ljg3TDExNTEuMjQgMTA0Mi43NkMxMTg2LjExIDg1Ni4yNTQgMTExOC40MyA3MDkuOTM5IDEwMTguMTYgNjEzLjc2M0M5NTkuODE0IDU1MC4yOTQgODczLjU4NCA0OTcuMTgyIDgxNi40NzMgNDY5LjI5M0M3NTYuNTkzIDQ0NS41MDUgNzAzLjE3MyA0MzAuMzMgNjM4LjM3MiA0MzQuMDIyQzY4NC41MTIgNDc0LjQyIDY4My40ODcgNTYxLjI2NSA2MzUuMjk2IDYxNS43MTFDNjY2Ljc3NCA1MjIuNDA1IDYyOC41MjkgNDYwLjM3MyA1OTMuNjY4IDQyOC45OTdDNTUwLjE5NCA0MzMuMjAxIDQ1NC45NCA0NTcuMjk3IDQxOS43NzEgNDgzLjk1NUM0MTkuODc0IDQ4OC40NjcgNDIxLjYxNyA1MDMuOTQ5IDQyNSA1MTQuMzA1QzQ0OS44MTQgNTM1LjIyMiA0NjYuNjI5IDU0NS42OCA1MDQuODc0IDU2OS4zNjZDNDgzLjAzNCA1NjcuOTMgNDcxLjM0NiA1NjQuMjM5IDQ0Ny44NjUgNTU5LjYyNUM2MTUuNDA1IDgyMS4xODggMTAwMC45MyA2NjEuMjM2IDExMzAuMDIgODY5LjM3OEMxMDMxLjc5IDc5NS41NTQgODYxLjg5NSA3NjAuNDg4IDgwNS42MDQgNzY0LjY5MkM4MTkuNDQ2IDc3OS42NjIgODQwLjE1OCA3OTcuNjA1IDg1Ny4zODQgODEwLjUyNEM3NTIuOTAyIDc5NS4yNDcgNzA4LjcxIDc5NS45NjQgNjYyLjY3MyA3NzAuNzQxQzYzMS4wOTIgNzU2LjM4NiA2MTYuOTQzIDcyNi45NTkgNTY3LjMxNyA3MDQuMjk5QzQ5OS4yMzUgNjczLjQzNyA0MTEuNjcxIDYwNy41MDggMzk4Ljg1NCA0NzYuMDZDNTAzLjQzOCA0MTcuMTA0IDcwOC43MSAzNDYuNzY2IDEwNDkuNTMgNDk4LjIwN1oiIGZpbGw9IiNDM0M0QkUiIHN0cm9rZT0iIzAwMTAxMCIgc3Ryb2tlLXdpZHRoPSIwLjAwMjIwNzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPHBhdGggZD0iTTEwMjguMzEgMTAyOC41MUMxMDA2Ljk4IDEwMjYuNDYgOTU4Ljk5NSAxMDI2LjQ2IDk0OC45NDYgMTAyNEMxMDI0LjMxIDEwMTAuNjcgMTA3NS44OCA5ODMuMDg4IDExMjEuNTEgOTEzLjQ2OEMxMTI0Ljc5IDk1OS4zIDEwODMuMjYgOTk0Ljk4MiAxMDI4LjMxIDEwMjguNTFaIiBmaWxsPSIjOUNDMEFDIiBzdHJva2U9IiMwMDEwMTAiIHN0cm9rZS13aWR0aD0iMC4wMDIyMDc4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjxwYXRoIGQ9Ik0xMTE4LjY0IDEyMzUuMDFDMTA5Ny43MiAxMjgzLjEgMTA2Ni40NSAxMzMwLjg4IDEwNDguMSAxMzYxLjMzQzEwNDYuMTIgMTM2MS4xMyAxMDQyLjk0IDEzNjAuMzggMTAzOC41NiAxMzU5LjA4QzEwNDIuODcgMTI3Ni44NSAxMDQwLjgyIDEyMjMuMzIgMTAzOS4wNyAxMTk4LjFDMTA1Ny45NCAxMjA1LjQ4IDEwODkuNTIgMTIxOS40MyAxMTE4LjY0IDEyMzUuMDFaIiBmaWxsPSIjOUNDMEFDIiBzdHJva2U9IiMwMDEwMTAiIHN0cm9rZS13aWR0aD0iMC4wMDIyMDc4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjxwYXRoIGQ9Ik0xNDA2LjU1IDEwOTIuOUMxNDAwLjQgMTE0Ny45NiAxMzI4LjkzIDEyNTEuMTEgMTI2NC43NSAxMzIwLjYzQzExODYuMTEgMTI2NC40NCAxMDI0LjMxIDExNzkuMjQgODQ4LjQ2MyAxMTI3Ljk3QzY2Ni4xNTkgMTA4MS44MyA1NDYuNTAyIDEwNzIuODEgMzYzLjU4MyAxMTA3Ljc3QzQ1Ni42ODMgMTA2OS42MyA1ODkuOTc3IDEwMTQuMTYgOTE0LjU5NyAxMDI0QzEwODkuNTIgMTAyNS40NCAxMjMzLjI3IDEwNTMuNjMgMTQwNi41NSAxMDkyLjlaIiBmaWxsPSIjMjZBNUI4IiBzdHJva2U9IiMwMDEwMTAiIHN0cm9rZS13aWR0aD0iMC4wMDIyMDc4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjxwYXRoIGQ9Ik0xMTU4LjczIDE0MDguM0MxMDQ4LjQgMTMzMC4xNiA2MjguOTQgMTI3MSAzNzIuMDk0IDEzODcuNThDNjE1LjgxNSAxNTcxLjEyIDkwNS4yNjcgMTU1OS40MyAxMTU4LjczIDE0MDguM1oiIGZpbGw9IiMyNkE1QjgiIHN0cm9rZT0iIzAwMTAxMCIgc3Ryb2tlLXdpZHRoPSIwLjAwMjIwNzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPHBhdGggZD0iTTMyNS42NDUgMTM1MC44OEMyOTkuNjAyIDEzMzcuMjQgMjI3LjkzMSAxMjYzLjgzIDIwMi42MDUgMTIwOC4xNUMzNjkuODM3IDExNjkuOSA2MzQuNTc4IDExMzUuMzUgODQ5LjY5MyAxMjY4LjAzQzU4MC4wMzEgMTIzNy4wNiA0NTAuMjIzIDEyNjIuMjkgMzI1LjY0NSAxMzUwLjg4WiIgZmlsbD0iIzI2QTVCOCIgc3Ryb2tlPSIjMDAxMDEwIiBzdHJva2Utd2lkdGg9IjAuMDAyMjA3OCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIvPgo8cGF0aCBkPSJNMTY2LjQxMiAxMTMzLjkyQzE1MS4xMzQgMTEwMC4yOCAxMTcuNDAxIDEwMzMuNDMgMTA4LjA3IDkyNC4yMzdDMTYxLjY5NSA5MDUuMDYzIDQ5NC4xMDggODUwLjEwNiA3MjYuNDQ5IDk0Mi4zODZDNTE4LjEwMSA5NDcuNjE1IDMwNy4wODggMTAzMS41OSAxNjYuNDEyIDExMzMuOTJaIiBmaWxsPSIjQzhCQUEwIiBzdHJva2U9IiMwMDEwMTAiIHN0cm9rZS13aWR0aD0iMC4wMDIyMDc4IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjxwYXRoIGQ9Ik0xNDQxLjgyIDk3Ni4xMTZDMTUwNC4zNyAzOC4zNDU5IDI0Ny4xMDUgLTgzLjM2MTIgMTAzLjU1OSA4MzIuNjcyTDE0NC41NzIgODM2LjA1NkMyOTcuNDQ5IC0xOS40ODMgMTQ0MC43IDkzLjkxODkgMTQwMC40IDk3Mi41MjhMMTQ0MS44MiA5NzYuMTE2WiIgZmlsbD0iI0M4QkFBMCIgc3Ryb2tlPSIjMDAxMDEwIiBzdHJva2Utd2lkdGg9IjAuMDAyMjA3OCIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIvPgo8cGF0aCBkPSJNNTIxLjg5NSA0NzguMzE3QzUzNS41MzIgNDc4LjMxNyA1NDYuNjA2IDQ4Ny45NTUgNTQ2LjYwNiA0OTkuODQ5QzU0Ni42MDYgNTExLjY0IDUzNS41MzIgNTIxLjI3OCA1MjEuODk1IDUyMS4yNzhDNTA4LjI1OCA1MjEuMjc4IDQ5Ny4xODUgNTExLjY0IDQ5Ny4xODUgNDk5Ljg0OUM0OTcuMTg1IDQ4Ny45NTUgNTA4LjI1OCA0NzguMzE3IDUyMS44OTUgNDc4LjMxN1oiIGZpbGw9IiNDM0M0QkUiIHN0cm9rZT0iIzAwMTAxMCIgc3Ryb2tlLXdpZHRoPSIwLjAwMjIwNzgiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPC9zdmc+Cg==" width="500" height="100" alt="piscicola"/>

                  <p>${mensaje}</p>   
                  <form>
                  <a href="https://dory-web-app-tests.herokuapp.com/reset-password?token=${token}" style=" color:#ffffff; text-decoration:none;  border-radius:20px; border: 1px solid #19A3A6; background-color:#19A3A6; font-family:Arial,Helvetica,sans-serif; width: 205px;     margin-top: 20px; height: fit-content; padding:5px 40px; font-weight:normal;  font-size:12px;">Actualizar Password </a></form>
                  </center>
                  </br>
                  `;

                  let transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false, // true for 465, false for other ports --color gris #343A40
                  auth: {
                  user: "plataforma.piscicola@gmail.com", // generated ethereal user
                  pass: "krxg hgff tfqc bcry", // generated ethereal password
                  },
                  });

                  // send mail with defined transport object
                  let info = await transporter.sendMail({
                  from: '"Recuperar Contraseña " <plataforma.piscicola@gmail.com>', // user
                  to: email, //email---ginelect@unisucre.edu.co 
                  subject: "Recuperar Contraseña", // Subject line
                  html: contentHtml, // html body
                  });

                  let message = 'Enlace de actualización de contraseña enviado con éxito al correo eléctronico';
                  return {message};
                }
                  throw createError(404,"El usuario no se encuentra registrado en la bd");
     }
       throw createError(400,"Un problema con los parametros ingresados"); 
}


module.exports = {
  getMultiple,
  updatePassword,
  recoverPassword
}