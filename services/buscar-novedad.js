const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1, cadena, token){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  let user=-1;
    if(token){
       const payload=helper.parseJwt(token);
       user=payload.sub;
    }
            const rows = await db.query(
            `SELECT distinctrow   n.id_novedad, n.titulo, n.autor,n.url_foto_autor,n.url_foto_novedad,n.resumen,n.fecha_creacion,n.cant_visitas ,
                                    (select count(*) from me_gustas m1 where  m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                                    n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                                    c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                                   (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta
            FROM  novedades as n left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)
                              left join tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad)
                              left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                              left join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)

            WHERE  n.titulo like ? or n.autor like ? or n.cuerpo like ? or n.resumen like ?
            order by n.id_novedad
            LIMIT ?,?`, 
              [user,cad, cad, cad, cad, offset, config.listPerPage]
            );

            
            if(rows[0] != undefined){

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


            }
            else{ 
              console.log("No hay novedad con esa busqueda");
            }
              
            const data = helper.emptyOrRows(nuevoRows);
            const meta = {page};

            return {
              data,
              meta
            }
  
}/*Fin getMultiple*/




/*------------------------------------buscar novedad por su tipo-----------------------------*/

async function getTipo(page = 1, tipo, token){

    const offset = helper.getOffset(page, config.listPerPage);
    let cad= tipo;
    let user=-1;

      if(token){
        const payload=helper.parseJwt(token);
        user=payload.sub;
      }

      const rows = await db.query(
        `SELECT  n.id_novedad, n.titulo, n.autor,n.url_foto_autor,n.url_foto_novedad,n.resumen,n.fecha_creacion,n.cant_visitas ,
                (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta
        FROM  novedades as n left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)
                        left join tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad)
                        left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                        left join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
        WHERE (n.id_tipo_novedad=tn.id_tipo_novedad) and (tn.nombre like ?)
        order by n.id_novedad
        LIMIT ?,?`, 
        [user,cad, offset, config.listPerPage]
      );

      
      if(rows[0] != undefined){

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


      }
      else{ 
        console.log("No hay novedad con esa busqueda");
      }
        
      const data = helper.emptyOrRows(nuevoRows);
      const meta = {page};

      return {
        data,
        meta
      }
}/*Falta terminarlo bien*/




/*------------------------------------buscar novedad por articulo-----------------------------*/


async function getArticulos(page = 1, cadena,token){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  let user=-1;

      if(token){
        const payload=helper.parseJwt(token);
        user=payload.sub;
      }

  const rows = await db.query(
    `SELECT DISTINCT  n.id_novedad,   n.titulo,  n.autor,  n.url_foto_autor,  n.url_foto_novedad,  n.resumen,  n.fecha_creacion,  n.cant_visitas ,
                      (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                      n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                      c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                      (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta     
      FROM  novedades as n inner join  tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad and tn.nombre like 'Articulo' )   
                          left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)  
                          left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                          inner join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
      WHERE n.titulo like ? or n.autor like ? or n.cuerpo like ? or n.resumen like ?
      order by n.id_novedad
      LIMIT ?,?`, 
    [user,cad, cad, cad, cad, offset, config.listPerPage]
  );
     
  if(rows[0] != undefined){

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

  }
  else{ 
    console.log("No hay novedad con esa busqueda");
  }
    
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }

}//fin getArticulos

/*------------------------------------buscar novedad por articulo colombiano----------------------------*/


async function getArticulosColombianos(page = 1, cadena,token){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  let user=-1;

      if(token){
        const payload=helper.parseJwt(token);
        user=payload.sub;
      }

  const rows = await db.query(
    `SELECT DISTINCT  n.id_novedad,   n.titulo,  n.autor,  n.url_foto_autor,  n.url_foto_novedad,  n.resumen,  n.fecha_creacion,  n.cant_visitas ,
                      (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                      n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                      c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                      (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta      
      FROM  novedades as n inner join  tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad and tn.nombre like 'Articulo-Colombia' )   
                          left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)  
                          left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                          inner join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
      WHERE n.titulo like ? or n.autor like ? or n.cuerpo like ? or n.resumen like ?
      order by n.id_novedad
      LIMIT ?,?`, 
    [user,cad, cad, cad, cad, offset, config.listPerPage]
  );
     
  if(rows[0] != undefined){

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

  }
  else{ 
    console.log("No hay novedad con esa busqueda");
  }
    
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }

}//fin getArticulosColombianos


/*------------------------------------buscar novedad por revista----------------------------*/


async function getRevistas(page = 1, cadena,token){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  let user=-1;

      if(token){
        const payload=helper.parseJwt(token);
        user=payload.sub;
      }

  const rows = await db.query(
    `SELECT DISTINCT  n.id_novedad,   n.titulo,  n.autor,  n.url_foto_autor,  n.url_foto_novedad,  n.resumen,  n.fecha_creacion,  n.cant_visitas ,
                      (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                      n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                      c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                      (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta      
      FROM  novedades as n inner join  tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad and tn.nombre like 'Revista' )   
                          left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)  
                          left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                          inner join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
      WHERE n.titulo like ? or n.autor like ? or n.cuerpo like ? or n.resumen like ?
      order by n.id_novedad
      LIMIT ?,?`, 
    [user,cad, cad, cad, cad, offset, config.listPerPage]
  );
     
  if(rows[0] != undefined){

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

  }
  else{ 
    console.log("No hay novedad con esa busqueda");
  }
    
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }

}//fin getRevistas

/*------------------------------------buscar novedad por Noticia----------------------------*/


async function getNoticias(page = 1, cadena,token){
  const offset = helper.getOffset(page, config.listPerPage);
  let cad= '%'+cadena+'%';
  let user=-1;

      if(token){
        const payload=helper.parseJwt(token);
        user=payload.sub;
      }

   const rows = await db.query(
    `SELECT DISTINCT  n.id_novedad,   n.titulo,  n.autor,  n.url_foto_autor,  n.url_foto_novedad,  n.resumen,  n.fecha_creacion,  n.cant_visitas ,
                      (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
                      n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
                      c.id_categoria,  c.nombre_categoria,c.descripcion_categoria,
                      (select count(*) from me_gustas as m2 where m2.id_novedad_pk_fk=n.id_novedad and m2.usuarios_id=?) as me_gusta      
      FROM  novedades as n inner join  tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad and tn.nombre like 'Noticia' )   
                          left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)  
                          left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                          inner join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
      WHERE n.titulo like ? or n.autor like ? or n.cuerpo like ? or n.resumen like ? 
      order by n.id_novedad
      LIMIT ?,?`, 
    [user,cad, cad, cad, cad, offset, config.listPerPage]
   );
     
  if(rows[0] != undefined){

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

  }
  else{ 
    console.log("No hay novedad con esa busqueda");
  }
    
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }

}//fin getNoticias



module.exports = {
  getMultiple,
  getTipo,
  getArticulos,
  getArticulosColombianos,
  getRevistas,
  getNoticias
}