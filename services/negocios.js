const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________getNegocioUsuario ________________________________*/
async function getNegocioUsuario(page = 1,id_user){
      const offset = helper.getOffset(page, config.listPerPage);
      const rows = await db.query(
        `SELECT n.*
        FROM negocios as n, usuarios as u
        WHERE u.id=n.usuarios_id and n.usuarios_id=? 
        LIMIT ?,?`, 
        [id_user, offset, config.listPerPage]
      );
      const data = helper.emptyOrRows(rows);      
      const meta = {page};
      return {
        data,
        meta
      }
}/*End getNegocioUsuario*/

/*_____________getMultiple ________________________________*/
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM negocios LIMIT ?,?`, 
    [offset, config.listPerPage]
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};
  return {
    data,
    meta
  }
}/*End GetMultiple*/

/*_____________Create Negocio________________________________*/
async function createNegocio(body,token){          
    if(token && validarToken(token)){
          try {                   
                const payload=helper.parseJwt(token);
                const id_user=payload.sub;              
                if(body.nombre_negocio===undefined || 
                   body.descripcion_negocio===undefined ||
                   body.imagen===undefined || 
                   body.id_departamento===undefined || 
                   body.id_municipio===undefined 
                  )
                {
                  throw createError(400,"Se requieren todos los parámetros!");
                }
                 const result = await db.query(
                    `INSERT INTO negocios (nombre_negocio,descripcion_negocio,imagen,usuarios_id,id_departamento,id_municipio) VALUES (?,?,?,?,?,?)`, 
                    [
                      body.nombre_negocio,
                      body.descripcion_negocio,
                      body.imagen,
                      id_user,
                      body.id_departamento,
                      body.id_municipio
                    ]
                ); 
                if (result.affectedRows) {              
                    return {message:'Negocio creado exitosamente'};
                }
                   throw createError(500,"Se presento un problema al registrar el negocio");
          }catch (error) {
                throw error;
          } 
     }else{
          throw createError(401,"Usted no tiene autorización"); 
     }
  }/*End Create*/

  /*____________________________updateNegocio__________________________*/
  async function updateNegocio(idNegocio, body, token){     
    if(token && validarToken(token)){
              const payload=helper.parseJwt(token);  
              const id_user=payload.sub;
        const rows = await db.query(
          `SELECT n.usuarios_id
          FROM negocios as n
          WHERE n.usuarios_id=?`, 
          [id_user]
        );
        if(rows.length<=0){
          return {message:'Usted no tiene autorización para éste proceso'};
        }   
      try { 
            if(body.nombre_negocio===undefined || 
              body.descripcion_negocio===undefined ||
              body.imagen===undefined || 
              body.id_departamento===undefined || 
              body.id_municipio===undefined 
             )
            {
              throw createError(400,"Se requieren todos los parámetros!");
            }
            const result = await db.query(
              `UPDATE negocios 
               SET nombre_negocio=?,
                   descripcion_negocio=?,
                   imagen=?,
                   usuarios_id=?,
                   id_departamento=?,
                   id_municipio=?
               WHERE id_negocio=?`,
               [
                body.nombre_negocio,
                body.descripcion_negocio,
                body.imagen,
                id_user,
                body.id_departamento,
                body.id_municipio,
                idNegocio
               ] 
            );          
            if (result.affectedRows) {              
              return {message:'Negocio Actualizado exitosamente'};
            }
             throw createError(500,"Se presento un problema al actualizar el negocio");
      }catch (error) {           
            throw error;
      } 
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End updateNegocio*/
  
   /*_____________eliminarNegocio ________________________________*/
  async function eliminarNegocio(id_negocio,token){
    
    if(token && validarToken(token)){
              const payload=helper.parseJwt(token);  
              const id_user=payload.sub;
            const rows = await db.query(
              `SELECT n.usuarios_id
              FROM negocios as n
              WHERE n.usuarios_id=?`, 
              [id_user]
            );
            if(rows.length<=0){
              return {message:'Usted no tiene autorización para éste proceso'};
            }
          try {               
                const result = await db.query(
                  `DELETE FROM negocios WHERE id_negocio=?`, 
                  [id_negocio]
                );       
                if (result.affectedRows) {              
                  return {message:'Negocio eliminado exitosamente'};
                }
                throw createError(500,"Se presento un problema al eliminar el negocio");
           }catch (error) {           
                 throw error;
           } 
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End eliminarNegocio*/
  
module.exports = {
  getMultiple, 
  createNegocio,
  updateNegocio,
  eliminarNegocio,
  getNegocioUsuario  
}