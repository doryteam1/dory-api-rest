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
                          preguntas[preguntas.length-1].fotos=arrayfotos;/*Arreglo de fotos agregado al final del arreglo de granjas */
                          preguntas.push(element);
                          arrayfotos=[];  
                          arrayfotos.push(element.foto);
                }
              });
                preguntas[preguntas.length-1].fotos=arrayfotos; 
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
          if(rows.length<1){
            return {message:'El usuario ingresado no tiene preguntas en el foro'};
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
  const data = helper.emptyOrRows(preguntas);       
  return {
    data
  }
}/*End getPreguntasUsuario*/









/*_____________getRespuestasPregunta ________________________________*/
async function getRespuestasPregunta(idPregunta){
        const rows = await db.query(
          `SELECT r.idrespuestaf as id, r.id_preguntaf as preguntaId, r.respuesta, r.fecha, r.usuarios_id as usuarioId,  
                  (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=r.usuarios_id) as nombreUsuario,
                  (select u2.foto from  usuarios as u2  where   u2.id=r.usuarios_id) as fotoUsuario
          FROM respuestasforos as r left join preguntasforos as p on (p.id_preguntaf = r.id_preguntaf)
          WHERE r.id_preguntaf=?
          order by p.fecha desc
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
    `SELECT  r.id_preguntaf as preguntaId, p.titulo ,r.idrespuestaf as id, r.respuesta, r.fecha, r.usuarios_id as usuarioId,  
            (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=r.usuarios_id) as nombreUsuario,
            (select u2.foto from  usuarios as u2  where   u2.id=r.usuarios_id) as fotoUsuario
    FROM respuestasforos as r left join preguntasforos as p on (p.id_preguntaf = r.id_preguntaf)
    order by p.fecha desc
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
                 body.cargar_archivo===undefined 
                )
              {
                throw createError(400,"Se requieren todos los parámetros!");
              }
              const currentDate = new Date();    
              const fecha = currentDate.toISOString();
              const result = await db.query(
                  `INSERT INTO respuestasforos (usuarios_id,id_preguntaf,fecha,respuesta,cargar_archivo) VALUES (?,?,?,?,?)`, 
                  [
                    id_user,
                    body.idpregunta,
                    fecha,
                    body.respuesta,
                    body.cargar_archivo
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

module.exports = {
  getPreguntasForos,
  getPreguntasUsuario,
  getRespuestasPregunta,
  getTodasRespuestas,
  registrarRespuesta,
  registrarPregunta
 }





/*

  /*____________________________updateNegocio__________________________
  async function updateForo(idNegocio, body, token){     
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
              body.longitud===undefined ||
              body.informacion_adicional_direccion===undefined
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
                   longitud=?,
                   informacion_adicional_direccion=?
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
                body.informacion_adicional_direccion,
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
  
   /*_____________eliminarNegocio ________________________________
  async function eliminarForo(id_negocio,token){
    
    if(token && validarToken(token)){
            const payload=helper.parseJwt(token);  
            const id_user=payload.sub;
            const rows = await db.query(
              `SELECT n.usuarios_id
              FROM negocios as n
              WHERE n.usuarios_id=?`, 
              [id_user]
            );
            if(rows.length<1){
              return {message:'Usted no tiene autorización para éste proceso'};
            }
          try {
                await db.query(
                  `DELETE FROM fotosNegocios WHERE id_negocio_fk=?`, 
                  [id_negocio]
                );
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

   /*_____________updatePhotosNegocio ________________________________
  async function updatePhotosForo(idNegocio,body,token){  
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

  /*_____________getDetailNegocio ________________________________
  async function getDetailForo(idNegocio, token){
    try{
      let rows=[];  
      rows = await db.query(
        `SELECT neg.*, ( select m.nombre from municipios as m where m.id_municipio=neg.id_municipio) as municipio,
                (select d.nombre_departamento from departamentos as d where d.id_departamento=neg.id_departamento) as departamento,
                (select Concat(u2.nombres,' ',u2.apellidos) from  usuarios as u2  where   u2.id=neg.usuarios_id) as propietario,
                (select u2.email from  usuarios as u2  where   u2.id=neg.usuarios_id) as email,
                (select u2.celular from  usuarios as u2  where   u2.id=neg.usuarios_id) as celular
        FROM negocios as neg
        WHERE neg.id_negocio=?
        `, 
        [idNegocio]
      ); 
    
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
      var preguntas = new Array();
      preguntas.push(rows[0]);
      preguntas[preguntas.length-1].fotos_negocio=arrayfotos; 

      const data = helper.emptyOrRows(preguntas);                      
      return {
        data
      }
    } catch(err){        
          console.log(err);
          throw err;
    }
}/*getDetailNegocio*/


/*------------------------------updateParcialNegocio-------------------------------------------------
async function updateParcialForo(idNegocio, negocio, token){
  
  if(token && validarToken(token))
  {
    const payload=helper.parseJwt(token);  
    const id_user=payload.sub;
    const rol = payload.rol;
    if(rol != "Comerciante"){
      throw createError('401', "Usted no es un usuario Comerciante. No esta autorizado para actualizar el negocio.")
    }      
    const rows2 = await db.query(
      `select neg.*
       from negocios as neg
       where neg.usuarios_id = ? and neg.id_negocio = ? `, 
      [
        id_user,
        idNegocio
      ]
    );
    if(rows2.length < 1 ){
      throw createError('401', 'El usuario no es propietario del negocio y no esta autorizado para actualizarla.')
    }
  
    var atributos = Object.keys(negocio);   
    if(atributos.length!=0)
    {    
      var params = Object.values(negocio);   
      var query = "update negocios set ";
      params.push(idNegocio);

      for(var i=0; i < atributos.length; i++) {
        query = query + atributos[i] + '=?,';
      }
      query = query.substring(0, query.length-1);
      query = query +' '+'where id_negocio=?'

      const result = await db.query(query,params);
    
      let message = '';
      if (result.affectedRows) {
        message = 'Negocio actualizado exitosamente';
      }else{
        throw createError(500,"No se pudo actualizar el registro del negocio");    
      }
      return {message};
    }
    throw createError(400,"No hay parametros para actualizar");
}else{
  throw createError(401,"Usuario no autorizado");
}
}/*End updateParcialForo*/