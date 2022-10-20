const db = require('./db');
const helper = require('../helper');
const config = require('../config');
var createError = require('http-errors');
const {validarToken} = require ('../middelware/auth');

async function getDashboard(){
         try{
                  const conection= await db.newConnection(); /*conection of TRANSACTION */
                  await conection.beginTransaction();
                  let cantidadGranjas = await conection.execute(
                  `SELECT count(*) as granjas
                    FROM granjas 
                    `, 
                    []
                  );
                  let data={};
                  let Granjas=cantidadGranjas[0][0].granjas; 
                  console.log('cantidad Granjas Valor',' ',cantidadGranjas[0]);
                    let cantidadAsociaciones = await conection.execute(
                    `SELECT count(*) as asociaciones
                      FROM asociaciones 
                      `, 
                      []
                    );  
                    let Asociaciones=cantidadAsociaciones[0][0].asociaciones;
                      let cantidadpescadores = await conection.execute(
                      `SELECT count(*) as pescadores
                       FROM usuarios as u left join tipos_usuarios as tu on u.id_tipo_usuario=tu.id_tipo_usuario
                       WHERE tu.nombre_tipo_usuario like('%Pescador%')
                      `, 
                        []
                      ); 
                      let Pescadores=cantidadpescadores[0][0].pescadores;
                      let cantidadpiscicultores = await conection.execute(
                      `SELECT count(*) as piscicultores
                         FROM usuarios as u left join tipos_usuarios as tu on u.id_tipo_usuario=tu.id_tipo_usuario
                         WHERE tu.nombre_tipo_usuario like('%Piscicultor%')
                        `, 
                          []
                      ); 
                      let Piscicultores= cantidadpiscicultores[0][0].piscicultores;
                      let cantidadusuarios = await conection.execute(
                          `SELECT count(*) as usuarios
                           FROM usuarios 
                          `, 
                            []
                      ); 
                      let Usuarios=cantidadusuarios[0][0].usuarios; 
                   data={Granjas, Asociaciones, Pescadores, Piscicultores, Usuarios  };
                  await conection.commit(); 
                        conection.release();         
                  return {data};
            }catch(error){
                   throw error;
            }
}/* const data = helper.emptyOrRows(rows);*/

module.exports = {
  getDashboard
} 