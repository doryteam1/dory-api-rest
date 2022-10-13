const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/* ------------------------------------ObtenerSlid------------------------------------*/
async function obtenerSlid(){      
       const rows = await db.query(
        `SELECT * 
         FROM sliders`,            
       []
       );  
       const data = helper.emptyOrRows(rows);
       return { data };
      
}/* End obtenerSlid*/


/* ------------------------------------crearSlid------------------------------------*/
async function crearSlid(body,token){   
  try{
          if(token && validarToken(token)){
              let payload=helper.parseJwt(token);
              let rol= payload.rol; 
                if(rol!='Administrador'){
                        throw createError(401,"Usted no tiene autorización para registrar el slid");
                }
                if(body.url_imagen === undefined || 
                   body.url_enlace === undefined || 
                   body.url_titulo === undefined 
                )
                {
                    throw createError(400,"Debe enviar todos los parámetros del slid para su registro");
                }
                const result = await db.query(
                `INSERT INTO sliders (url_imagen,url_enlace,titulo) VALUES (?,?,?)`,                
                 [body.url_imagen,body.url_enlace,body.titulo] 
                );  
              let message = 'Error registrando el slid';  
              if (result.affectedRows) {
                message = 'Registro exitoso de Slid';
              }  
              return {message};
          }else{ 
              throw createError(401,"Usted no tiene autorización"); 
          }
      }catch(error){
          throw error;
      }
}/* End crearSlid*/

/* ------------------------------------actualizarSlid------------------------------------*/
async function actualizarSlid(idSlid,body,token){   
        try{
                if(token && validarToken(token)){
                    let payload=helper.parseJwt(token);
                    let rol= payload.rol; 
                      if(rol!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar slid");
                      }
                      if(body.url_imagen === undefined || 
                         body.url_enlace === undefined || 
                         body.url_titulo === undefined 
                      )
                      {
                          throw createError(400,"Debe enviar todos los parámetros del slid para la actualización");
                      }
                      const result = await db.query(
                      `UPDATE sliders
                      SET url_imagen=?,
                          url_enlace=?,
                          titulo=?
                      WHERE id_slid=?`,
                      [
                        body.url_imagen,   
                        body.url_enlace, 
                        body.titulo,                    
                        idSlid
                      ] 
                    );  
                    let message = 'Error actualizando la información del slid';  
                    if (result.affectedRows) {
                      message = 'Actualización de Slid exitoso';
                    }  
                    return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
            }catch(error){
                throw error;
            }
}/* End actualizarSlid*/

/* ------------------------------------eliminarSlid------------------------------------*/
async function eliminarSlid(idSlid,token){   
     try{
          if(token && validarToken(token)){
              let payload=helper.parseJwt(token);
              let rol= payload.rol; 
                if(rol!='Administrador'){
                        throw createError(401,"Usted no tiene autorización para eliminar slid");
                }
                 const result = await db.query(
                 `DELETE from sliders where id_slid=?`,
                  [idSlid]
                  );   
                  let message='Error al eliminar slid';                  
                  if (result.affectedRows) {
                          message = 'Slid borrado exitosamente';
                  } 
                  return {message};                              
          }else{ 
              throw createError(401,"Usted no tiene autorización"); 
          }
      }catch(error){
          throw error;
      }
}/* End eliminarSlid*/



/* ------------------------------------actualizarCarruselSlid------------------------------------*/
async function actualizarCarruselSlid(body,token){   
          try{
                  if(token && validarToken(token)){
                      let payload=helper.parseJwt(token);
                      let rol= payload.rol; 
                        if(rol!='Administrador'){
                                throw createError(401,"Usted no tiene autorización para actualizar slider");
                        }
                        const conection= await db.newConnection(); /*conection of TRANSACTION */
                          try{                                  
                                  await conection.beginTransaction();
                                  var carrusel=body.arraySliders;
                                  let message = 'Actualización exitosa del slid';    console.log(carrusel);                             
                                  await db.query(
                                    `DELETE FROM sliders`, 
                                    []
                                  );                                 
                                  for(var i=0;i<carrusel.length;i++){
                                    await db.query(
                                      `INSERT INTO sliders(url_imagen,url_enlace,titulo) VALUES (?,?,?)`,
                                      [carrusel[i].url_imagen, carrusel[i].url_enlace, carrusel[i].titulo]
                                    );
                                  }
                                  await conection.commit(); 
                                  conection.release();
                                  return {message}; 
                            }catch(error){
                                    conection.rollback(); /*Si hay algún error  */ 
                                    conection.release();
                                    throw error;        
                            }
                  }else{ 
                      throw createError(401,"Usted no tiene autorización"); 
                  }
              }catch(error){
                  throw error;
              }
}/* End actualizarCarruselSlid*/


module.exports = {
  obtenerSlid,
  crearSlid,
  actualizarSlid,
  eliminarSlid,
  actualizarCarruselSlid
}
