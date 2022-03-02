const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');

async function getMultiple(page = 1,token){

      const payload=helper.parseJwt(token);
      const offset = helper.getOffset(page, config.listPerPage);
      const rows=[];

      if(token){
        
         rows = await db.query(
        `SELECT distinctrow  n.id_novedad,  n.autor,n.url_foto_autor,n.url_foto_novedad,n.titulo,n.resumen,n.fecha_creacion,n.cant_visitas ,
                (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                (select count(*) from me_gustas as m2,novedades as n2, usuarios as u where m2.id_novedad_pk_fk=n2.id_novedad and m2.usuarios_id=? and m2.id_novedad_pk_fk=n2.id_novedad and n2.id_novedad=n.id_novedad and u.id=?) as me_gusta          
                FROM  novedades as n left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)
                              left join tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad)
                              left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                              left join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
          order by  n.id_novedad
          LIMIT ?,?`, 
        [payload.sub,payload.sub,offset, config.listPerPage]
      );
    }else{
           rows = await db.query(
      `SELECT distinctrow  n.id_novedad,  n.autor,n.url_foto_autor,n.url_foto_novedad,n.titulo,n.resumen,n.fecha_creacion,n.cant_visitas ,
              (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
              n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
              c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
              (select count(*) from me_gustas as m2,novedades as n2, usuarios as u where m2.id_novedad_pk_fk=n2.id_novedad and m2.usuarios_id=u.id and m2.id_novedad_pk_fk=n2.id_novedad and n2.id_novedad=n.id_novedad) as me_gusta          
              FROM  novedades as n left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)
                            left join tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad)
                            left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                            left join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
        order by  n.id_novedad
        LIMIT ?,?`, 
      [offset, config.listPerPage]
    );

    }

        var arraycategorias= new Array();
        var nuevoRows = new Array();
        var index= rows[0].id_novedad;
        nuevoRows.push(rows[0]);
        
        rows.forEach((element)=>{ 
          
          if((index == element.id_novedad))
          { 
            arraycategorias.push(element.nombre_categoria);
          }else { 
                    index= element.id_novedad;
                    nuevoRows[nuevoRows.length-1].categorias=arraycategorias;/*Arreglo de categorias agregado al final del arreglo de novedades */
                    nuevoRows.push(element);
                    arraycategorias=[];  
                    arraycategorias.push(element.nombre_categoria);
          }
        });
          nuevoRows[nuevoRows.length-1].categorias=arraycategorias;
          
        const data = helper.emptyOrRows(nuevoRows);
        const meta = {page};

        return {
          data,
          meta
        }
}


/*--------------------------------CREATE---------------------------------------- */ 

async function create(novedad){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
    await conection.beginTransaction();

    if(novedad.titulo!= undefined && 
      novedad.autor!= undefined && 
      novedad.cuerpo!= undefined && 
      novedad.fecha_creacion!= undefined && 
      novedad.resumen!= undefined && 
      novedad.cant_visitas!= undefined && 
      novedad.url_foto_autor!= undefined && 
      novedad.url_foto_novedad!= undefined && 
      novedad.url_novedad!= undefined && 
      novedad.canal!= undefined && 
      novedad.email_autor!= undefined && 
      novedad.id_tipo_novedad!= undefined && 
      novedad.usuarios_id!= undefined 
    ){

    try {
      const result = await db.query(
        `INSERT INTO novedades(id_novedad, titulo,autor,cuerpo,fecha_creacion,resumen,cant_visitas,url_foto_autor,url_foto_novedad,url_novedad,canal,email_autor,id_tipo_novedad,usuarios_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
        [
          novedad.id_novedad,
          novedad.titulo,
          novedad.autor,
          novedad.cuerpo,
          novedad.fecha_creacion,
          novedad.resumen,
          novedad.cant_visitas,
          novedad.url_foto_autor,
          novedad.url_foto_novedad,
          novedad.url_novedad,
          novedad.canal,
          novedad.email_autor,
          novedad.id_tipo_novedad,
          novedad.usuarios_id
        ]
      ); 
          
       let message = 'Error creando novedad';
           
      if (result.affectedRows) {
        message = {  insertId: result.insertId, message:'novedad creada exitosamente'};
      }
      
      const rowsId = await db.query(
        `SELECT MAX(id_novedad) AS id FROM novedades`
      ); /*ultimo Id_novedad que se creo con autoincremental*/
  
      var categorias=JSON.parse(novedad.arrayCategorias);/*Pasar el string a vector*/
     
     for(var i=0;i<categorias.length;i++){
        await db.query(
          `INSERT INTO categorias_novedades(id_categoria_pk_fk,id_novedad_pk_fk) VALUES (?,?)`,
          [categorias[i], rowsId[0].id]
        );
     }

     await conection.commit(); 
     return {message};

    } catch (error) {
      await conection.rollback(); /*Si hay algún error  */ 
      return {message:'Registro de novedad fallida (transacciónes)'};
    }

  }
  throw createError(400,"Un problema con los parametros ingresados"); 
        
  }//End Function Create


  /*--------------------------------UPDATE---------------------------------------- */ 

  async function update(id, novedad){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
     conection.beginTransaction();


    if(novedad.titulo!= undefined && 
      novedad.autor!= undefined && 
      novedad.cuerpo!= undefined && 
      novedad.fecha_creacion!= undefined && 
      novedad.resumen!= undefined && 
      novedad.cant_visitas!= undefined && 
      novedad.url_foto_autor!= undefined && 
      novedad.url_foto_novedad!= undefined && 
      novedad.url_novedad!= undefined && 
      novedad.canal!= undefined && 
      novedad.email_autor!= undefined && 
      novedad.id_tipo_novedad!= undefined && 
      novedad.usuarios_id!= undefined 
    ){

    try {
      const result = await db.query(
        `UPDATE novedades 
         SET titulo=?,
             autor=?,
             cuerpo=?,
             fecha_creacion=?,
             resumen=?,
             cant_visitas=?,
             url_foto_autor=?,
             url_foto_novedad=?,
             url_novedad=?,
             canal=?,
             email_autor=?,
             id_tipo_novedad=?,
             usuarios_id=? 
         WHERE id_novedad=?`,
         [
          novedad.titulo,
          novedad.autor,
          novedad.cuerpo,
          novedad.fecha_creacion,
          novedad.resumen,
          novedad.cant_visitas,
          novedad.url_foto_autor,
          novedad.url_foto_novedad,
          novedad.url_novedad,
          novedad.canal,
          novedad.email_autor,
          novedad.id_tipo_novedad,
          novedad.usuarios_id,
          id
         ] 
      );
    
      let message = 'Error actualizando novedad';
        
      if (result.affectedRows) {
        message = 'Novedad actualizada exitosamente';
       }
    
        var categorias=JSON.parse(novedad.arrayCategorias);/*Pasar el string a vector*/
  
      await db.query(
        `DELETE from categorias_novedades where id_novedad_pk_fk=?`,
        [id]
      );
     
     for(var i=0;i<categorias.length;i++){
        await db.query(
          `INSERT INTO categorias_novedades(id_categoria_pk_fk,id_novedad_pk_fk) VALUES (?,?)`,
          [categorias[i], id]
        );
     }
  
      conection.commit(); 
     return {message};

    } catch (error) {
       conection.rollback(); /*Si hay algún error  */ 
      return {message:'Error al actualizar la novedad con transacciones'};
    }
  }
  throw createError(400,"Un problema con los parametros ingresados al actualizar"); 

  }//End Function update

  
/*--------------------------------REMOVE---------------------------------------- */ 

  async function remove(id){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
     conection.beginTransaction();
    let message = 'Error borrando novedad';

    try {
             await db.query(
               `DELETE from categorias_novedades where id_novedad_pk_fk=?`,
                 [id]
                 );  /*Elimino la relación de la novedad en la tabla categorias_novedades */
      
          const result = await db.query(
            `DELETE FROM novedades WHERE id_novedad=?`, 
            [id]
          );  
            
          if (result.affectedRows) {
            message = 'Novedad borrado exitosamente';
          }
            
          conection.commit(); 
         return {message};

    } catch (error) {
       conection.rollback(); /*Si hay algún error  */ 
      return {message:'Error al eliminar la novedad (transacciones)'};
  }

  }/*fin remove*/


  /*--------------------------------UPDATE Visitas---------------------------------------- */ 

  async function updateVisitas(id){

          let contador;
          const rows = await db.query(
            `SELECT  *       
            FROM  novedades as n 
            WHERE  n.id_novedad=?
            `, 
            [id]
          );

      if(rows!=null && rows.length>0){

        contador=rows[0].cant_visitas+1;
        
          try {
                const result = await db.query(
                  `UPDATE novedades 
                  SET cant_visitas=?
                  WHERE id_novedad=?`,
                  [
                    contador,
                    id
                  ] 
                );
              
                let message = 'Error actualizando la visita en la novedad';
                  
                if (result.affectedRows) {
                  message = 'Visita de la novedad actualizada exitosamente';
                }
              
              return {message};

          } catch (error) {
                return {message:'Error al actualizar la visita de la novedad'};
              }
      }
      throw createError(404,"La Novedad No existe"); 

}//End Function update visitas


/*--------------------------------AGREGAR--LIKE-------------------------------------- */ 

async function agregarLikes(datos){

        const{id_novedad,id_user,}=datos;
        let message = 'Error ingresando like a novedad';
        
      if(id_novedad!=undefined && id_user!=undefined && id_novedad!=null && id_user!=null){

            try {
  
                  const result = await db.query(
                    `INSERT INTO me_gustas(id_novedad_pk_fk,usuarios_id) VALUES (?,?)`, 
                    [
                      id_novedad,
                      id_user
                    ]
                  );
      
                  if (result.affectedRows) { 
                    message = 'Like de novedad agregado exitosamente';
                  }
                  return {message};

            } catch(err) {
                throw createError(400,err.message);
                   }
     }
      throw createError(400,"Error por parámetros ingresados"); 
      
}//End Function Create

/*--------------------------------REMOVE--LIKE-------------------------------------- */ 

async function eliminarLikes(datos){

       const{id_novedad,id_user,}=datos;
       let message = 'Error al eliminar like a novedad';
  
      if(id_novedad!=undefined && id_user!=undefined && id_novedad!=null && id_user!=null){

              try {

                const result= await db.query(
                  `DELETE from me_gustas where id_novedad_pk_fk=? and usuarios_id=?`,
                    [id_novedad,id_user]
                    ); 
         
                     if (result.affectedRows) {
                      message = 'Like de novedad eliminado exitosamente';
                    }
                    return {message};

              } catch {
                        message = 'Eliminación fallida de likes a novedad';
                        return {message};
                      }
      }
        throw createError(400,"Parámetros ingresados erroneamente"); 
  
}/*fin remove like*/


module.exports = {
  getMultiple,
  create,
  update,
  remove,
  updateVisitas,
  agregarLikes,
  eliminarLikes
}