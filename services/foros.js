const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

/*_____________getPreguntasForos ________________________________*/
async function getPreguntasForos(){
      const rows = await db.query(
        `SELECT p.id_preguntaf as id, p.titulo, p.descripcion, p.fecha, p.usuarios_id as usuarioId, fp.fotopf as foto, 
                (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=p.usuarios_id) as nombreUsuario,
                (select u2.foto from  usuarios as u2  where   u2.id=p.usuarios_id) as fotoUsuario,
                (select count(*) from  respuestasforos as rf left join usuarios as u2 on ( u2.id=rf.usuarios_id) where rf.id_preguntaf=p.id_preguntaf) as countRespuestas
         FROM preguntasforos as p left join fotospreguntas as fp on p.id_preguntaf = fp.id_preguntaf
         order by p.fecha desc
        `, 
        []
      );
            let data = [];
            if(rows.length<1){
              return {data};
            }

              var arrayfotos= new Array();
              var preguntas = new Array();  
              var index= rows[0].id;
              preguntas.push(rows[0]);        
              rows.forEach((element)=>{                      
                      if((index == element.id))
                      { 
                        arrayfotos.push(element.foto);
                      }else { 
                                index= element.id;
                                preguntas[preguntas.length-1].fotos=arrayfotos;
                                preguntas.push(element);
                                arrayfotos=[];  
                                arrayfotos.push(element.foto);
                      }                  
              });
                preguntas[preguntas.length-1].fotos=arrayfotos; 
                preguntas.forEach((element)=>{                      
                  if((element.foto==null))
                  { 
                    element.fotos=[];
                  }              
                });
                data = helper.emptyOrRows(preguntas);                
              return {
                data
              }
}/*End getPreguntasForos*/

/*_____________getPreguntasUsuario ________________________________*/
async function getPreguntasUsuario(idusuario){
          const rows = await db.query(
            `SELECT p.id_preguntaf as id, p.titulo, p.descripcion, p.fecha, p.usuarios_id as usuarioId, fp.fotopf as foto, 
                    (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=p.usuarios_id) as nombreUsuario,
                    (select u2.foto from  usuarios as u2  where   u2.id=p.usuarios_id) as fotoUsuario,
                    (select count(*) from  respuestasforos as rf left join usuarios as u2 on ( u2.id=rf.usuarios_id) where rf.id_preguntaf=p.id_preguntaf) as countRespuestas
            FROM preguntasforos as p left join fotospreguntas as fp on p.id_preguntaf = fp.id_preguntaf
            WHERE p.usuarios_id=?
            order by p.fecha desc
            `, 
            [idusuario]
          );
          let data = [];
            if(rows.length<1){
              return {data};
            }
          var fotosN= new Array();
          var preguntas = new Array();
          var index= rows[0].id;
          preguntas.push(rows[0]);        
          rows.forEach((element)=>{           
            if((index == element.id))
            { 
              fotosN.push(element.foto);
            }else { 
                      index= element.id;
                      preguntas[preguntas.length-1].fotos=fotosN;
                      preguntas.push(element);
                      fotosN=[];  
                      fotosN.push(element.foto);
            }
          });
          preguntas[preguntas.length-1].fotos=fotosN;                       
          data = helper.emptyOrRows(preguntas);       
          return {
            data
          }
}/*End getPreguntasUsuario*/

/*_____________getRespuestasPregunta ________________________________*/
async function getRespuestasPregunta(idPregunta){
        const rows = await db.query(
          `SELECT r.idrespuestaf as id, r.id_preguntaf as preguntaId, r.respuesta, r.fecha, r.usuarios_id as usuarioId, r.foto,
                  (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=r.usuarios_id) as nombreUsuario,
                  (select u2.foto from  usuarios as u2  where   u2.id=r.usuarios_id) as fotoUsuario
          FROM respuestasforos as r left join preguntasforos as p on (p.id_preguntaf = r.id_preguntaf)
          WHERE r.id_preguntaf=?
          order by r.fecha desc
          `, 
          [idPregunta]
        );                     
        const data = helper.emptyOrRows(rows);       
        return {
          data
        }
}/*End getRespuestasPregunta */

/*_____________getTodasRespuestas ________________________________*/
async function getTodasRespuestas(){
  const rows = await db.query(
    `SELECT  r.id_preguntaf as preguntaId, p.titulo ,r.idrespuestaf as id, r.respuesta, r.fecha, r.usuarios_id as usuarioId, r.foto, 
            (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=r.usuarios_id) as nombreUsuario,
            (select u2.foto from  usuarios as u2  where   u2.id=r.usuarios_id) as fotoUsuario
    FROM respuestasforos as r left join preguntasforos as p on (p.id_preguntaf = r.id_preguntaf)
    order by r.fecha desc
    `, 
    []
  );                     
  const data = helper.emptyOrRows(rows);       
  return {
    data
  }
}/*End getTodasRespuestas */

/*_________________registrarRespuesta_________________________________*/
async function registrarRespuesta(body,token){          
  if(token && validarToken(token)){
        try {                   
              const payload=helper.parseJwt(token);
              const id_user=payload.sub;              
              if(body.idpregunta===undefined || 
                 body.respuesta===undefined || 
                 body.foto===undefined 
                )
              {
                throw createError(400,"Se requieren todos los parámetros!");
              }
              const currentDate = new Date();    
              const fecha = currentDate.toISOString();
              const result = await db.query(
                  `INSERT INTO respuestasforos (usuarios_id,id_preguntaf,fecha,respuesta,foto) VALUES (?,?,?,?,?)`, 
                  [
                    id_user,
                    body.idpregunta,
                    fecha,
                    body.respuesta,
                    body.foto
                  ]
              ); 
              if (result.affectedRows) {              
                  return {
                          message:'Respuesta registrada exitosamente',
                          insertId:result.insertId
                  };
              }
                 throw createError(500,"Se presento un problema al registrar la respuesta");
        }catch (error) {
              throw error;
        } 
   }else{
        throw createError(401,"Usted no tiene autorización"); 
   }
}/*End registrarRespuesta*/

/*_________________registrarPregunta_________________________________*/
async function registrarPregunta(body,token){          
  if(token && validarToken(token)){
        try {                   
              const payload=helper.parseJwt(token);
              const id_user=payload.sub;              
              if(body.titulo===undefined || 
                 body.descripcion===undefined 
                )
              {
                throw createError(400,"Se requieren todos los parámetros!");
              }
              const currentDate = new Date();    
              const fecha = currentDate.toISOString();
              const result = await db.query(
                  `INSERT INTO preguntasforos (titulo,descripcion,fecha,usuarios_id) VALUES (?,?,?,?)`, 
                  [
                    body.titulo,
                    body.descripcion,
                    fecha,
                    id_user
                  ]
              ); 
              if (result.affectedRows) {              
                  return {
                          message:'Pregunta registrada exitosamente',
                          insertId:result.insertId
                  };
              }
                 throw createError(500,"Se presento un problema al registrar la pregunta");
        }catch (error) {
              throw error;
        } 
   }else{
        throw createError(401,"Usted no tiene autorización"); 
   }
}/*End registrarPregunta*/

/*____________________________actualizarPregunta__________________________*/
  async function actualizarPregunta(idpregunta, body, token){     
          if(token && validarToken(token)){
                    const payload=helper.parseJwt(token);  
                    const id_user=payload.sub;
                    const rows = await db.query(
                      `SELECT p.usuarios_id
                        FROM preguntasforos as p
                        WHERE p.usuarios_id=? and p.id_preguntaf=?`, 
                        [id_user,idpregunta]
                     );
                    if(rows.length<1){
                      return {message:'Usted no tiene autorización para éste proceso'};
                    }
                    const norespuesta = await db.query(
                      `SELECT count(r.usuarios_id)
                        FROM respuestasforos as r
                        WHERE r.id_preguntaf=?`, 
                        [idpregunta]
                     ); 
                    if(norespuesta.length<1){
                      throw createError(500,"Pregunta de foro no puede ser editada, se han asignado respuestas a la pregunta");
                    }  
               try{ 
                  if(body.titulo===undefined || body.descripcion===undefined)
                   {
                     throw createError(400,"Se requieren todos los parámetros!");
                   }
                  const result = await db.query(
                    `UPDATE preguntasforos 
                     SET titulo=?,
                        descripcion=?
                     WHERE id_preguntaf=?`,
                     [
                      body.titulo,
                      body.descripcion,
                      idpregunta
                    ] 
                    );          
                    if (result.affectedRows) {              
                      return {message:'Pregunta Actualizada exitosamente'};
                    }
                    throw createError(500,"Se presento un problema al actualizar la pregunta del foro");
                }catch (error) {           
                      throw error;
                } 
              }else{
                throw createError(401,"Usted no tiene autorización"); 
              }
  }/*End actualizarPregunta*/

/*____________________________actualizarRespuesta__________________________*/
async function actualizarRespuesta(idrespuesta, body, token){     
          if(token && validarToken(token)){
                    const payload=helper.parseJwt(token);  
                    const id_user=payload.sub;
                    const rows = await db.query(
                      `SELECT r.respuesta
                        FROM respuestasforos as r
                        WHERE r.usuarios_id=? and r.idrespuestaf=?`, 
                        [id_user,idrespuesta]
                    );
                    if(rows.length<1){
                      return {message:'Usted no tiene autorización para éste proceso'};
                    }                 
              try{ 
                  if(body.respuesta===undefined || body.foto===undefined)
                  {
                    throw createError(400,"Se requieren todos los parámetros!");
                  }
                  const result = await db.query(
                    `UPDATE respuestasforos 
                    SET respuesta=?,
                        foto=?
                    WHERE idrespuestaf=?`,
                    [
                      body.respuesta,
                      body.foto,
                      idrespuesta
                    ] 
                    );          
                    if (result.affectedRows) {              
                      return {message:'Respuesta Actualizada exitosamente'};
                    }
                    throw createError(500,"Se presento un problema al actualizar la respuesta a pregunta del foro");
                }catch (error) {           
                      throw error;
                } 
              }else{
                throw createError(401,"Usted no tiene autorización"); 
      }
}/*End actualizarRespuesta*/


 /*_____________eliminarPregunta________________________________*/
  async function eliminarPregunta(idpregunta,token){
    const conection= await db.newConnection();
    await conection.beginTransaction();
    if(token && validarToken(token)){
            const payload=helper.parseJwt(token);  
            const id_user=payload.sub;
            const rows = await db.query(
              `SELECT p.usuarios_id
               FROM preguntasforos as p
               WHERE p.usuarios_id=? and p.id_preguntaf=?`, 
               [id_user, idpregunta]
            );
            if(rows.length<1){
              return {message:'Usted no tiene autorización para éste proceso'};
            }
          try {
               await conection.execute(
                  `DELETE FROM fotospreguntas WHERE id_preguntaf=?`, 
                  [idpregunta]
                );
                await conection.execute(
                  `DELETE FROM respuestasforos WHERE id_preguntaf=?`, 
                  [idpregunta]
                );
                const result = await conection.execute(
                  `DELETE FROM preguntasforos WHERE id_preguntaf=?`, 
                  [idpregunta]
                );
                let message = '';   
                 if (result[0]['affectedRows'] > 0)
                  {
                       message = 'Pregunta de foro eliminada exitosamente';
                   }else{
                        throw createError(500,'Se presento un problema al eliminar la pregunta del foro');
                   }                                  
                await conection.commit(); 
                conection.release();                
                return { message };
           }catch (error) {           
                  await conection.rollback(); 
                  conection.release();
                  throw error;
           }         
    }else{
      throw createError(401,"Usted no tiene autorización"); 
    }
  }/*End eliminarPregunta*/

 /*_____________eliminarRespuesta________________________________*/
 async function eliminarRespuesta(idrespuesta,token){
          if(token && validarToken(token)){
                  const payload=helper.parseJwt(token);  
                  const id_user=payload.sub;
                  const rows = await db.query(
                    `SELECT r.usuarios_id
                    FROM respuestasforos as r
                    WHERE r.usuarios_id=? and r.idrespuestaf=?`, 
                    [id_user, idrespuesta]
                  );
                  if(rows.length<1){
                    return {message:'Usted no tiene autorización para éste proceso'};
                  }
                try {                    
                      const result = await db.query(
                        `DELETE FROM respuestasforos WHERE idrespuestaf=? and usuarios_id=?`, 
                        [idrespuesta, id_user]
                      );
                      if (result.affectedRows) {  
                           return{message:'Respuesta de foro eliminada exitosamente'};
                        }else{
                              throw createError(500,'Se presento un problema al eliminar la respuesta del foro');
                        }    
                      }catch (error) {   
                              throw error;
                      }         
          }else{
            throw createError(401,"Usted no tiene autorización"); 
          }
}/*End eliminarRespuesta*/



     /*_____________actualizarFotosPregunta ________________________________*/
  async function actualizarFotosPregunta(idpregunta,body,token){ 
     if(body.arrayFotos.length>5){
         throw createError(400,"Capacidad de almacenamiento sobrepasado, cinco es la cantidad máxima");
     }
    var arrayfotos= body.arrayFotos; 
    const conection= await db.newConnection();
    await conection.beginTransaction();
    if(token && validarToken(token)){
        let payload=helper.parseJwt(token);        
        let userN= payload.sub;         
        try{            
                if(arrayfotos){ 
                  try{  
                        const preguntaDeUsuario= await db.query(
                        `SELECT *
                        FROM preguntasforos as p
                        WHERE p.usuarios_id=? and p.id_preguntaf=? `,
                          [userN,idpregunta]
                        );
                       
                        if(preguntaDeUsuario.length<0){
                           throw createError(401,"Usuario no autorizado");
                        }

                        await db.query(
                        `DELETE from fotospreguntas where id_preguntaf=?`,
                          [idpregunta]
                        );       
                        for(var i=0;i<arrayfotos.length;i++){
                            await db.query(
                              `INSERT INTO fotospreguntas(fotopf,id_preguntaf) VALUES (?,?)`,
                              [arrayfotos[i], idpregunta]
                            );
                        }                         
                  }catch(err) {
                        throw createError(400,err.message);
                  }
                }else{
                  throw createError(400,"Usted no agrego las fotos para actualizarlas"); 
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
  }/* End actualizarFotosPregunta */

module.exports = {
  getPreguntasForos,
  getPreguntasUsuario,
  getRespuestasPregunta,
  getTodasRespuestas,
  registrarRespuesta,
  registrarPregunta,
  actualizarPregunta,
  actualizarRespuesta,
  eliminarPregunta,
  eliminarRespuesta,
  actualizarFotosPregunta
 }
