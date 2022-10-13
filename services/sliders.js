const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');

/* ------------------------------------actualizarSlider------------------------------------*/
async function actualizarSlider(idSlider,body,token){   
        try{
                if(token && validarToken(token)){
                    let payload=helper.parseJwt(token);
                    let rol= payload.rol; 
                      if(rol!='Administrador'){
                              throw createError(401,"Usted no tiene autorización para actualizar slider");
                      }
                      if(body.url_imagen === undefined || 
                         body.url_enlace === undefined || 
                         body.url_titulo === undefined 
                      )
                      {
                          throw createError(400,"Debe enviar todos los parámetros del slider para la actualización");
                      }
                      const result = await db.query(
                      `UPDATE slider
                      SET url_imagen=?,
                          url_enlace=?,
                          titulo=?
                      WHERE id_slider=?`,
                      [
                        body.url_imagen,   
                        body.url_enlace, 
                        body.titulo,                    
                        idSlider
                      ] 
                    );  
                    let message = 'Error actualizando la información del slider';  
                    if (result.affectedRows) {
                      message = 'Actualización de Slider exitoso';
                    }  
                    return {message};
                }else{ 
                    throw createError(401,"Usted no tiene autorización"); 
                }
            }catch(error){
                throw error;
            }
}/* End actualizarSlider*/

/* ------------------------------------actualizarCarruselSlider------------------------------------*/
async function actualizarCarruselSliders(body,token){   
          try{
                  if(token && validarToken(token)){
                      let payload=helper.parseJwt(token);
                      let rol= payload.rol; 
                        if(rol!='Administrador'){
                                throw createError(401,"Usted no tiene autorización para actualizar slider");
                        }
                          try{
                                  const conection= await db.newConnection(); /*conection of TRANSACTION */
                                  await conection.beginTransaction();
                                  var carrusel=body.arraySliders;
                                  let message = 'Actualización exitosa del slider';                                 
                                  await db.query(
                                    `DELETE FROM sliders`, 
                                    []
                                  );                                 
                                  for(var i=0;i<carrusel.length;i++){
                                    await db.query(
                                      `INSERT INTO sliders(url_imagen,url_enlace,titulo) VALUES (?,?,?)`,
                                      [carrusel[i].url_imagen, carrusel[i].url_enlace, carrusel[i].titulo]
                                    );
                                  }
                                  await conection.commit(); 
                                  conection.release();
                                  return {message}; 
                            }catch(error){
                                    conection.rollback(); /*Si hay algún error  */ 
                                    conection.release();
                                    throw error;        
                            }
                  }else{ 
                      throw createError(401,"Usted no tiene autorización"); 
                  }
              }catch(error){
                  throw error;
              }
}/* End actualizarCarruselSlider*/


module.exports = {
  actualizarSlider,
  actualizarCarruselSliders
}

/*  const rowsEspecies = await db.query(
                  `SELECT e.*
                  FROM especies as e
                  `, 
                  []
                );        
                const rowsMunicipios = await db.query(
                  `SELECT m.*
                  FROM municipios as m
                  WHERE m.id_departamento_fk=?
                  `, 
                  [idDepartamento]
                );   
                let data=[];           
                let rowsConsumos;
                let arrayConsumo=[];
                  for(let i=0; i<rowsMunicipios.length;i++){   
                    arrayConsumo=[];
                    for(let j=0; j<rowsEspecies.length;j++){
                          rowsConsumos= await db.query(
                            `SELECT e.nombre as especie, sum(eu.cantidad_consumo) as consumo, count(eu.usuarios_id) as cantidad_usuario,
                            ( select m.id_municipio from municipios as m where m.id_municipio=u.id_municipio ) as id_municipio
                            FROM especies_usuarios as eu inner join especies as e on e.id_especie=eu.id_especie_pk_fk
                                                        inner join usuarios as u on u.id=eu.usuarios_id
                                                        inner join municipios as m on u.id_municipio=m.id_municipio
                            WHERE eu.id_especie_pk_fk=? and u.id_municipio=?
                            `, 
                            [rowsEspecies[j].id_especie,rowsMunicipios[i].id_municipio]
                          );                                
                          if(rowsConsumos[0].consumo==null){
                                rowsConsumos[0].especie=rowsEspecies[j].nombre;
                                rowsConsumos[0].consumo=0;
                          }
                          rowsConsumos[0].id_municipio = undefined;
                          arrayConsumo.push(rowsConsumos[0]);
                                
                    }
                    data.push({
                      municipio:rowsMunicipios[i].nombre,
                      id_municipio:rowsMunicipios[i].id_municipio,
                      consumo:arrayConsumo
                    })
                  }             
              return {
              data
              }*/