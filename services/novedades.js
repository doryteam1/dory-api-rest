const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow  n.id_novedad,  n.autor,n.url_foto_autor,n.url_foto_novedad,n.titulo,n.resumen,n.fecha_creacion,n.cant_visitas,
    (select count(*) from me_gustas m1,novedades n1 where m1.id_novedad_pk_fk=n1.id_novedad and m1.id_novedad_pk_fk= n.id_novedad) as likes ,
     n.url_novedad,n.email_autor,n.canal,n.cuerpo,n.id_tipo_novedad as tipo_novedad,tn.nombre as tipo,
     c.id_categoria,
     c.nombre_categoria,c.descripcion_categoria
FROM novedades n,me_gustas m,categorias c,categorias_novedades cn,tipos_novedades tn
where (n.id_tipo_novedad=tn.id_tipo_novedad) and (c.id_categoria=cn.id_categoria_pk_fk) and (cn.id_novedad_pk_fk=n.id_novedad)
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
    const result = await db.query(
      `INSERT INTO novedades(id_novedad, titulo,autor,cuerpo,fecha_creacion,resumen,cant_visitas,url_foto_autor,url_foto_novedad,url_novedad,canal,email_autor,id_tipo_novedad,cedula_usuario_fk) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, 
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
        novedad.cedula_usuario_fk
      ]
    );
  
    let message = 'Error creando novedad';
  
    if (result.affectedRows) {
      message = {  insertId: result.insertId, message:'novedad creada exitosamente'};
    }
  
    return {message};
  }

  async function update(id, novedad){
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
           cedula_usuario_fk=? 
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
        novedad.cedula_usuario_fk,
        id
       ] 
    );
  
    let message = 'Error actualizando novedad';
  
    if (result.affectedRows) {
      message = 'Novedad actualizada exitosamente';
    }
  
    return {message};
  }
  
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