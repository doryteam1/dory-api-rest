const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________getPublicacionesUsuario ________________________________*/
async function getPublicacionesUsuario(id_user){
    try{ 
      const rows = await db.query(
        `SELECT p.id_publicacion, p.cantidad, p.preciokilogramo, 
                (select e.nombre from especies as e where e.id_especie= p.id_especie_fk) as especie,
                (select m.nombre from municipios as m where m.id_municipio = p.id_municipio_fk) as municipio,
                (select concat (u.nombres,' ',u.apellidos) from usuarios as u where u.id= p.usuarios_id) as publicado_por,
                fp.fotop
        FROM publicaciones as p left join fotosPublicaciones as fp on (fp.id_publicacion_fk = p.id_publicacion)
        WHERE p.usuarios_id=?
        `, 
        [id_user]
      );
    if(rows.length<1){
      throw createError(404,"Usuario sin publicaiones");
    }
      var arrayfotos= new Array();
      var nuevoRows = new Array();
      var index= rows[0].id_publicacion;
      nuevoRows.push(rows[0]);        
      rows.forEach((element)=>{           
        if((index == element.id_publicacion))
        { 
          if(element.fotop){
                arrayfotos.push(element.fotop);
          }          
        }else { 
                  index= element.id_publicacion;
                  nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
                  nuevoRows.push(element);
                  arrayfotos=[];  
                  if(element.fotop){
                      arrayfotos.push(element.fotop);
                  } 
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
}/*End getPublicacionesUsuario*/

/*_____________getPublicacionesMultiple ________________________________*/
async function getPublicacionesMultiple(page = 1){
      const offset = helper.getOffset(page, config.listPerPage);
      const rows = await db.query(
        `SELECT p.id_publicacion, p.cantidad, p.preciokilogramo, 
                (select e.nombre from especies as e where e.id_especie= p.id_especie_fk) as especie,
                (select m.nombre from municipios as m where m.id_municipio = p.id_municipio_fk) as municipio,
                (select concat (u.nombres,' ',u.apellidos) from usuarios as u where u.id= p.usuarios_id) as publicado_por,
                fp.fotop
        FROM publicaciones as p left join fotosPublicaciones as fp on (fp.id_publicacion_fk = p.id_publicacion)
        order by p.id_publicacion asc`, 
        []
      );
      let resultSet = rows;
      if(rows.length > 0){
        let publicaciones = [];
        let currentPublicacion = { ...rows[0], fotos:[]}
        for(let i=0; i<rows.length; i++){
            if(rows[i].id_publicacion == currentPublicacion.id_publicacion){
              if(rows[i].fotop){
                currentPublicacion.fotos.push(rows[i].fotop)
              }
            }else{
              currentPublicacion.foto = undefined;
              publicaciones.push(currentPublicacion);
              currentPublicacion = { ...rows[i], fotos:[] };
              if(rows[i].fotop){
                currentPublicacion.fotos.push(rows[i].fotop)
              }
            }
        }
        resultSet = publicaciones;
      }      
      const data = helper.emptyOrRows(resultSet);
      const meta = {page};
      return {
        data,
        meta
      }
}/*End getPublicacionesMultiple*/

/*_____________Create Publicación________________________________*/
async function createPublicacion(body,token){          
    if(token && validarToken(token)){
          try {                   
                const payload=helper.parseJwt(token);
                const id_user=payload.sub;              
                if(body.cantidad===undefined || 
                   body.preciokilogramo===undefined ||                   
                   body.id_especie===undefined || 
                   body.id_municipio===undefined ||                   
                   body.usuarios_id===undefined
                  )
                {
                  throw createError(400,"Se requieren todos los parámetros!");
                }
                 const result = await db.query(
                    `INSERT INTO publicaciones (cantidad,preciokilogramo,id_especie_fk,id_municipio_fk,usuarios_id) VALUES (?,?,?,?,?)`, 
                    [
                      body.cantidad,
                      body.preciokilogramo,                      
                      body.id_especie,
                      body.id_municipio,
                      id_user
                    ]
                ); 
                if (result.affectedRows) {              
                    return {
                            message:'Publicación creada exitosamente',
                            insertId:result.insertId
                    };
                }
                   throw createError(500,"Se presentó un problema al registrar la publicación");
          }catch (error) {
                throw error;
          } 
     }else{
          throw createError(401,"Usted no tiene autorización"); 
     }
  }/*End Create*/

  /*____________________________updatePublicacion__________________________*/
  async function updatePublicacion(idpublicacion, body, token){     
    if(token && validarToken(token)){
              const payload=helper.parseJwt(token);  
              const id_user=payload.sub;
        const rows = await db.query(
          `SELECT p.usuarios_id
          FROM publicaciones as p
          WHERE p.usuarios_id=?`, 
          [id_user]
        );
        if(rows.length<1){
          return {message:'Usted no tiene autorización para éste proceso'};
        }   
      try { 
            if(body.cantidad===undefined || 
              body.preciokilogramo===undefined ||                   
              body.id_especie===undefined || 
              body.id_municipio===undefined ||                   
              body.usuarios_id===undefined
             )
            {
              throw createError(400,"Se requieren todos los parámetros!");
            }
            const result = await db.query(
              `UPDATE publicaciones
               SET cantidad=?,
                   preciokilogramo=?,                   
                   id_especie_fk=?,
                   id_municipio_fk=?,
                   usuarios_id=?
               WHERE id_publicacion=?`,
               [
                body.cantidad,
                body.preciokilogramo,                      
                body.id_especie,
                body.id_municipio,
                id_user,
                idpublicacion
               ] 
            );          
            if (result.affectedRows) {              
              return {message:'Publicación Actualizada exitosamente'};
            }
             throw createError(500,"Se presento un problema al actualizar la publicación");
      }catch (error) {           
            throw error;
      } 
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End updatePublicacion*/
  
   /*_____________removePublicacion ________________________________*/
  async function removePublicacion(idpublicacion,token){
    
    if(token && validarToken(token)){
            const payload=helper.parseJwt(token);  
            const id_user=payload.sub;
            const rows = await db.query(
              `SELECT p.usuarios_id
              FROM publicaciones as p
              WHERE p.usuarios_id=?`, 
              [id_user]
            );
            if(rows.length<1){
              return {message:'Usted no tiene autorización para éste proceso'};
            }
          try {
                await db.query(
                  `DELETE FROM fotosPublicaciones WHERE id_publicacion_fk=?`, 
                  [idpublicacion]
                );
                const result = await db.query(
                  `DELETE FROM publicaciones WHERE id_publicacion=?`, 
                  [idpublicacion]
                );       
                if (result.affectedRows) {              
                  return {message:'Publicación eliminado exitosamente'};
                }
                throw createError(500,"Se presento un problema al eliminar la publicación");
           }catch (error) {           
                 throw error;
           } 
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End removePublicacion*/

   /*_____________updatePhotosPublicacion ________________________________*/
  async function updatePhotosPublicacion(idpublicacion,body,token){  
    var arrayfotos= body.arrayFotos;    
    let tipo_user=null;     
    const conection= await db.newConnection();
    await conection.beginTransaction();
    if(token && validarToken(token)){
        let payload=helper.parseJwt(token);
        tipo_user= payload.rol;
        let userN= payload.sub;         
        try{
            if(tipo_user!="Piscicultor" || tipo_user!="Pescador" ){ 
              throw createError(401,"Usted no tiene autorización");
            }else{
                if(arrayfotos){ 
                  try{  
                        const publicacionDeUsuario= await db.query(
                        `SELECT *
                        FROM publicaciones as p
                        WHERE p.usuarios_id=? and p.id_publicacion=? `,
                          [userN,idpublicacion]
                        );                       
                        if(publicacionDeUsuario.length<1){
                           throw createError(401,"Usuario no autorizado");
                        }
                        await db.query(
                        `DELETE from fotosPublicaciones where id_publicacion_fk=?`,
                          [idpublicacion]
                        );       
                        for(var i=0;i<arrayfotos.length;i++){
                            await db.query(
                              `INSERT INTO fotosPublicaciones(fotop,id_publicacion_fk) VALUES (?,?)`,
                              [arrayfotos[i], idpublicacion]
                            );
                        }                         
                  }catch(err) {
                        throw createError(400,err.message);
                  }
                }else{
                  throw createError(400,"Usted no agregó las fotos para actualizarlas"); 
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
  } //* updatePhotosPublicacion */

  /*_____________getDetailPublicacion ________________________________*/
  async function getDetailPublicacion(idpublicacion, token){
    try{
      let rows=[];  
       if(token && validarToken(token)){
                let payload=helper.parseJwt(token);
                id_user= payload.sub; 
                rows = await db.query(
                  `SELECT p.*
                  FROM publicaciones as p
                  WHERE  p.usuarios_id=? and p.id_publicacion=?
                  `, 
                  [id_user,idpublicacion]
                ); 
                if(rows.length < 1){
                  throw createError(404, "Usted no tiene ninguna publicación con el id "+idpublicacion+".")
                }
        }else{
          rows = await db.query(
            `SELECT p.*
            FROM publicaciones as p
            WHERE p.id_publicacion=?
            `, 
            [idpublicacion]
          ); 
        }
            if(rows.length < 1){
              throw createError(404, "No se encuentra la publicación con el id "+idpublicacion+".")
            }
          const rowsfotos = await db.query(
            `SELECT fp.id_foto_publicacion, fp.fotop
            FROM  fotosPublicaciones as fp
            WHERE fp.id_publicacion_fk =?
            `, 
          [idpublicacion]
          );  
          var arrayfotos= new Array();  
          rowsfotos.forEach((element)=>{ 
              arrayfotos.push(element.fotop);
          });      
          var nuevoRows = new Array();
          nuevoRows.push(rows[0]);
          nuevoRows[nuevoRows.length-1].fotos_publicacion=arrayfotos; 

          const data = helper.emptyOrRows(nuevoRows);                      
          return {
            data
          }
    } catch(err){        
          console.log(err);
          throw err;
    }
}/*getDetailPublicacion*/


/*------------------------------updateParcialPublicacion-------------------------------------------------*/
async function updateParcialPublicacion(idpublicacion, publicacion, token){
  
  if(token && validarToken(token))
  {
    const payload=helper.parseJwt(token);  
    const id_user=payload.sub;
    const rol = payload.rol;
    if(rol != "Piscicultor" || rol != "Pescador"){
      throw createError('401', "Usted no es un usuario Piscicultor ó Pescador. No esta autorizado para actualizar la publicación.")
    }      
    const rows2 = await db.query(
      `select p.*
       from publicaciones as p
       where p.usuarios_id = ? and p.id_publicacion = ? `, 
      [
        id_user,
        idpublicacion
      ]
    );
    if(rows2.length < 1 ){
      throw createError('401', 'El usuario no es propietario de la publicación y no esta autorizado para actualizarla.')
    }
   /* delete negocio.password; */
    var atributos = Object.keys(publicacion);   
    if(atributos.length!=0)
    {    
      var params = Object.values(publicacion);   
      var query = "update publicaciones set ";
      params.push(idpublicacion);

      for(var i=0; i < atributos.length; i++) {
        query = query + atributos[i] + '=?,';
      }
      query = query.substring(0, query.length-1);/*eliminar la coma final*/ 
      query = query +' '+'where id_publicacion=?'

      const result = await db.query(query,params);
    
      let message = '';
      if (result.affectedRows) {
        message = 'Publicación actualizada exitosamente';
      }else{
        throw createError(500,"No se pudó actualizar el registro del negocio");    
      }
      return {message};
    }
    throw createError(400,"No hay parámetros para actualizar");
}else{
  throw createError(401,"Usuario no autorizado");
}
}/*End updateParcialPublicacion*/


module.exports = {
  getPublicacionesUsuario, 
  getPublicacionesMultiple,
  createPublicacion,
  updatePublicacion,
  removePublicacion,
  updatePhotosPublicacion,
  getDetailPublicacion,
  updateParcialPublicacion
}