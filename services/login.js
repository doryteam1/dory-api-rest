const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt= require('bcrypt');
const jwt = require('jwt-simple');
var moment = require('moment');


async function createLogin(user){

  let email=user.email;
  
   const rows = await db.query(
    `SELECT u.password,u.email,u.id,tu.nombre_tipo_usuario
     FROM usuarios as u, tipos_usuarios as tu
     WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
           u.email=? 
    `, 
    [email]
  );
  console.log(user);
  let message = "El usuario no esta registrado o la contraseña es inválida";
  
  if(rows!=null && rows.length>0){
 
    let pass=rows[0].password;
    let passUser=user.password;

    if(( bcrypt.compareSync(passUser,pass))){
          var token=helper.createToken(rows[0]);
         return {token:token};
    }
  }
     return{message};
}//fin método


module.exports = {
  createLogin
}


   
    
