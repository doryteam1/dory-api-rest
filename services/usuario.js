const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const bcrypt= require('bcrypt');
const nodemailer = require('nodemailer');
const {validarToken} = require ('../middelware/auth');

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
                  <img src="http://sharpyads.com/wp-content/uploads/2022/03/logo-no-name-320x320.png" width="100" height="100" />

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

/*-------------------------------------changePassword---------------------------------*/  

async function changePassword(datos,token){

  const{antiguoPassword,newPassword,}=datos;
  let message = 'Error al cambiar Password de usuario';
  let iguales= false;

    if(token && validarToken(token)){
        const payload=helper.parseJwt(token);/*--saco la carga útil del token para averiguar el email del usuario----*/  
        const email=payload.email;
        
        if(email!=undefined && newPassword!=undefined && antiguoPassword!=undefined)
        {   
            try{
                const saltRounds= 10;
                const salt= bcrypt.genSaltSync(saltRounds);
                const passwordHash= bcrypt.hashSync( newPassword , salt);
                
                /*--------verificación de existencia de usuario--------*/                  
                  
                  const existbd = await db.query(
                    `SELECT u.password
                    FROM usuarios as u
                    WHERE u.email=? 
                    `, 
                    [email]
                  );

                  if(existbd.length<1){
                    throw createError(401,"Usuario no existe ó contraseña antigua incorrecta"); 
                  }

                  let pass = existbd[0].password;
                              
                  if(!( bcrypt.compareSync(antiguoPassword,pass))){
                      throw createError(401,"El usuario no existe ó el password antiguo es incorrecto"); 
                  }
                                    
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
                      return{message : 'Contraseña de Usuario cambiada exitosamente'};
                  }else{
                      throw createError(500,"Un problema al cambiar el password del usuario");
                  }
               
           } catch (error) {
                  if(!(error.statusCode==401)){
                        throw createError(500,"Un problema al cambiar el password del usuario");
                  }else{
                        throw error; 
                   }
             }
        }else{
            throw createError(400,"Email, password antiguo y nuevo password requeridos!"); 
        }     
          
    }else {
        throw createError(401,"Usted no tiene autorización"); 
     }
}//End updatePassword

module.exports = {
  getMultiple,
  updatePassword,
  recoverPassword,
  changePassword
}