const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1,id){
  const offset = helper.getOffset(page, config.listPerPage);

  const rows = await db.query(
    `SELECT g.id_granja, g.nombre, g.descripcion, g.area, g.numero_trabajadores, g.produccion_estimada_mes, g.direccion,
            g.latitud, g.longitud, g.id_departamento, g.id_municipio, g.id_corregimiento, g.id_vereda, f.id_foto, f.imagen
    FROM granjas as g, fotos as f
    WHERE (f.id_granja_fk = g.id_granja) and g.id_granja=?
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

    const rows2 = await db.query(
      `select e.nombre 
       from granjas g, especies_granjas eg, especies e
       where (e.id_especie=eg.id_especie_pk_fk) and 
             (eg.id_granja_pk_fk=g.id_granja) and 
             (g.id_granja=g.id_granja) and
             g.id_granja=? LIMIT ?,?`, 
      [id,offset, config.listPerPage]
    );

    var arrayespecies= new Array();

    rows2.forEach((element)=>{ 
           arrayespecies.push(element.nombre);
           nuevoRows[nuevoRows.length-1].especies=arrayespecies;/*Arreglo de especies agregado al final del arreglo de granjas */
    });

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