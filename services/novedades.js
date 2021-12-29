const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow  n.id_novedad,  n.autor,n.url_foto_autor,n.url_foto_novedad,n.titulo,n.resumen,n.fecha_creacion,n.cant_visitas ,
    (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
     n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
     c.id_categoria,  c.nombre_categoria,c.descripcion_categoria
     
FROM  novedades as n left join me_gustas m on (m.id_novedad_pk_fk=n.id_novedad)
                     left join tipos_novedades as tn on (n.id_tipo_novedad=tn.id_tipo_novedad)
                     left join categorias_novedades as cn on (cn.id_novedad_pk_fk=n.id_novedad)
                     left join categorias as c on (cn.id_categoria_pk_fk=c.id_categoria)
order by  n.id_novedad
LIMIT ?,?`, 
    [offset, config.listPerPage]
  );

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


async function create(novedad){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
    await conection.beginTransaction();
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
      return {message:'Error al crear la novedad con transacción'};
    }
        
  }//End Function Create

  async function update(id, novedad){

    const conection= await db.newConnection(); /*conection of TRANSACTION */
    await conection.beginTransaction();

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
  
     await conection.commit(); 
     return {message};

    } catch (error) {
      await conection.rollback(); /*Si hay algún error  */ 
      return {message:'Error al actualizar la novedad con transacciones'};
    }
   
  }//End Function update
  
  async function remove(id){
    const result = await db.query(
      `DELETE FROM novedades WHERE id_novedad=?`, 
      [id]
    );  
  
    let message = 'Error borrando novedad';
  
    if (result.affectedRows) {
      message = 'Novedad borrado exitosamente';
    }
  
    return {message};
  }

module.exports = {
  getMultiple,
  create,
  update,
  remove
}