const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________getNegocioUsuario ________________________________*/
async function getNegocioUsuario(id_user){
    try{ 
      const rows = await db.query(
        `SELECT n.*, f.foto_negocio
        FROM negocios as n left join fotosNegocios as f on (f.id_negocio_fk = n.id_negocio)
                           inner join usuarios as u on (u.id=n.usuarios_id and n.usuarios_id=?)
        `, 
        [id_user]
      );
    if(rows.length<1){
      throw createError(404,"Usuario sin negocios");
    }
      var arrayfotos= new Array();
      var nuevoRows = new Array();
      var index= rows[0].id_negocio;
      nuevoRows.push(rows[0]);        
      rows.forEach((element)=>{           
        if((index == element.id_negocio))
        { 
          arrayfotos.push(element.foto_negocio);
        }else { 
                  index= element.id_negocio;
                  nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
                  nuevoRows.push(element);
                  arrayfotos=[];  
                  arrayfotos.push(element.foto_negocio);
        }
      });
      nuevoRows[nuevoRows.length-1].fotos=arrayfotos;          
      const data = helper.emptyOrRows(nuevoRows);  
      return {
        data
      }
    }catch(err){
      throw err;
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
                   body.id_departamento===undefined || 
                   body.id_municipio===undefined || 
                   body.direccion===undefined 
                  )
                {
                  throw createError(400,"Se requieren todos los parámetros!");
                }
                 const result = await db.query(
                    `INSERT INTO negocios (nombre_negocio,descripcion_negocio,usuarios_id,id_departamento,id_municipio,direccion) VALUES (?,?,?,?,?,?)`, 
                    [
                      body.nombre_negocio,
                      body.descripcion_negocio,
                      id_user,
                      body.id_departamento,
                      body.id_municipio,
                      body.direccion
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
              body.id_departamento===undefined || 
              body.id_municipio===undefined || 
              body.direccion===undefined ||
              body.latitud===undefined || 
              body.longitud===undefined 
             )
            {
              throw createError(400,"Se requieren todos los parámetros!");
            }
            const result = await db.query(
              `UPDATE negocios 
               SET nombre_negocio=?,
                   descripcion_negocio=?,                   
                   usuarios_id=?,
                   id_departamento=?,
                   id_municipio=?,
                   direccion=?,
                   latitud=?,
                   longitud=?
               WHERE id_negocio=?`,
               [
                body.nombre_negocio,
                body.descripcion_negocio,
                id_user,
                body.id_departamento,
                body.id_municipio,
                body.direccion,
                body.latitud,
                body.longitud,
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

   /*_____________updatePhotosNegocio ________________________________*/
  async function updatePhotosNegocio(idNegocio,body,token){  
    var arrayfotos= body.arrayFotos;    
    let tipo_user=null;     
    const conection= await db.newConnection();
    await conection.beginTransaction();
    if(token && validarToken(token)){
        let payload=helper.parseJwt(token);
        tipo_user= payload.rol;
        let userN= payload.sub;         
        try{
            if(tipo_user!="Comerciante"){ 
              throw createError(401,"Usted no tiene autorización");
            }else{
                if(arrayfotos){ 
                  try{  
                        const negocioDeUsuario= await db.query(
                        `SELECT *
                        FROM negocios as n
                        WHERE n.usuarios_id=? and n.id_negocio=? `,
                          [userN,idNegocio]
                        );
                       
                        if(negocioDeUsuario.length<0){
                           throw createError(401,"Usuario no autorizado");
                        }

                        await db.query(
                        `DELETE from fotosNegocios where id_negocio_fk=?`,
                          [idNegocio]
                        );       
                        for(var i=0;i<arrayfotos.length;i++){
                            await db.query(
                              `INSERT INTO fotosNegocios(foto_negocio,id_negocio_fk) VALUES (?,?)`,
                              [arrayfotos[i], idNegocio]
                            );
                        }                         
                  }catch(err) {
                        throw createError(400,err.message);
                  }
                }else{
                  throw createError(400,"Usted no agrego las fotos para actualizarlas"); 
                }
          } 
          await conection.commit(); 
          conection.release();
          message = "Fotos actualizadas correctamente";
          return { message };
        }catch (error) {
          await conection.rollback(); 
          conection.release();
          throw error;
      } 
    }else{
      throw createError(401,"Usuario no autorizado");
    }
  } //* updatePhotosNegocio */

  /*_____________getDetailNegocio ________________________________*/
  async function getDetailNegocio(idNegocio, token){
    try{
      let rows=[];  
       if(token && validarToken(token)){
                let payload=helper.parseJwt(token);
                id_user= payload.sub; 
                rows = await db.query(
                  `SELECT neg.*
                  FROM negocios as neg
                  WHERE   neg.usuarios_id=? and neg.id_negocio=?
                  `, 
                  [id_user,idNegocio]
                ); 
                if(rows.length < 1){
                  throw createError(404, "Usted no tiene ningún negocio con el id "+idNegocio+".")
                }
        }else{
          rows = await db.query(
            `SELECT neg.*
            FROM negocios as neg
            WHERE neg.id_negocio=?
            `, 
            [idNegocio]
          ); 
        }
            if(rows.length < 1){
              throw createError(404, "No se encuentra el negocio con el id "+idNegocio+".")
            }
          const rowsfotos = await db.query(
            `SELECT fn.id_foto_negocio, fn.foto_negocio
            FROM  fotosNegocios as fn
            WHERE fn.id_negocio_fk =?
            `, 
          [idNegocio]
          );  
          var arrayfotos= new Array();  
          rowsfotos.forEach((element)=>{ 
              arrayfotos.push(element.foto_negocio);
          });      
          var nuevoRows = new Array();
          nuevoRows.push(rows[0]);
          nuevoRows[nuevoRows.length-1].fotos_negocio=arrayfotos; 

          const data = helper.emptyOrRows(nuevoRows);                      
          return {
            data
          }
    } catch(err){        
          console.log(err);
          throw err;
    }
}/*getDetailNegocio*/

module.exports = {
  getMultiple, 
  createNegocio,
  updateNegocio,
  eliminarNegocio,
  getNegocioUsuario,
  updatePhotosNegocio,
  getDetailNegocio
}