const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/* ------------------------------------getIndex------------------------------------*/
async function getIndex(){   
       const rows = await db.query(
        `SELECT * 
         FROM indexs`,            
       []
       );
      const data = helper.emptyOrRows(rows);      
       return { data };      
}/* End getIndex*/

/* ------------------------------------createIndex------------------------------------*/
async function createIndex(body,token){   
          try{
                  if(token && validarToken(token)){
                      let payload=helper.parseJwt(token);
                      let rol= payload.rol; 
                        if(rol!='Administrador'){
                                throw createError(401,"Usted no tiene autorización");
                        }
                        const conection= await db.newConnection(); /*conection of TRANSACTION */
                          try{                                  
                                  await conection.beginTransaction();
                                  var indices=body.index;
                                  let message = 'Registro exitoso';                                 
                                  await db.query(
                                    `DELETE FROM indexs`, 
                                    []
                                  );  
                                  const currentDate = new Date();
                                  const fecha = currentDate.toISOString();                               
                                  for(var i=0;i<indices.length;i++){
                                      if(!(indices[i].title === undefined ||  indices[i].href === undefined))
                                       {    
                                          await db.query(
                                          `INSERT INTO indexs(title,href,lastmodified) VALUES (?,?,?)`,
                                                [indices[i].title, indices[i].href, fecha]
                                          );
                                       }
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
}/* End createIndex*/

module.exports = {
  getIndex,
  createIndex
}
