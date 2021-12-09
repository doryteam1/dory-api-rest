const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `select distinct     g.id_granja, g.nombre,g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion,g.descripcion,f.id_foto,f.imagen,(select count(*) from reseñas r1,granjas g1 where r1.id_granja_pk_fk=g1.id_granja and r1.id_granja_pk_fk= g.id_granja) as count_reseñas,
    (select avg(puntuacion) from usuarios_granjas ug5 where g.id_granja=ug5.id_granja_pk_fk ) as puntuacion
from fotos as f, granjas as g, usuarios_granjas ug
where (f.id_granja_fk = g.id_granja) and
g.id_granja  in( select ug2.id_granja_pk_fk 
           from usuarios_granjas AS ug2,  granjas AS g2
          where g2.id_granja=ug2.id_granja_pk_fk and ug.id_granja_pk_fk=ug2.id_granja_pk_fk) and
     g.id_municipio=?
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