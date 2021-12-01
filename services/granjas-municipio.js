const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT distinctrow g.id_granja,g.nombre,g.area,g.numero_trabajadores,g.produccion_estimada_mes,g.direccion,g.latitud,g.longitud,g.descripcion,g.id_departamento,g.id_municipio,g.id_corregimiento,g.id_vereda,f.imagen,ug.puntuacion,ug.espropietario,ug.esfavorita,
                       (select count(*) from reseñas r1,granjas g1 where r1.id_granja_pk_fk=g1.id_granja and r1.id_granja_pk_fk= g.id_granja) as count_reseñas
     FROM  granjas as g left join fotos f on (g.id_granja=f.id_foto)
                      left join reseñas as r on (g.id_granja=r.id_granja_pk_fk)
                      left join usuarios_granjas as ug on (g.id_granja=ug.id_granja_pk_fk)
                      left join usuarios as u on (ug.cedula_usuario_pk_fk=u.cedula)
     WHERE  g.id_municipio=?
           LIMIT ?,?`, 
    [id,offset, config.listPerPage]
  );
  var arrayfotos= new Array();
  var nuevoRows = new Array();
  var index= rows[0].id_granja;
  nuevoRows.push(rows[0]);
  
  rows.forEach((element)=>{ 
     
    if((index == element.id_granja))
    { 
      arrayfotos.push(element.imagen);
    }else { 
              index= element.id_granja;
              nuevoRows[nuevoRows.length-1].fotos=arrayfotos;/*Arreglo de fotos agregado al final del arreglo de granjas */
              nuevoRows.push(element);
              arrayfotos=[];  
              arrayfotos.push(element.imagen);
    }
  });
    nuevoRows[nuevoRows.length-1].fotos=arrayfotos;
    
  const data = helper.emptyOrRows(nuevoRows);
  const meta = {page};

  return {
    data,
    meta
  }
}

module.exports = {
  getMultiple
}