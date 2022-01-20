const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt= require('bcrypt');
const jwt = require('jwt-simple');
var moment = require('moment');
//const token= require('crypto').randomBytes(64).toString('hex');


async function createLogin(user){

  let email=user.email;

  console.log("Logueando usuario...");
  
   const rows = await db.query(
    `SELECT u.password,u.email,u.id,tu.nombre_tipo_usuario
     FROM usuarios as u, tipos_usuarios as tu
     WHERE u.id_tipo_usuario=tu.id_tipo_usuario and
           u.email=? 
    `, 
    [email]
  );

  let message = '';

  if(rows!=null){
       createToken(rows);
      console.log(createToken(rows));
      message='creacion de token exitoso';
  }else{
    message="El usuario no esta registrado o la contraseña es inválida";
  }

const data = helper.emptyOrRows(rows);

return {
  message
}

}//End of methodo

async function createToken (user) {
  var payload = {
    sub: user.id,
    rol: user.nombre_tipo_usuario,
    email:user.email,
    iat: moment().unix(),
    exp: moment().add(14, "days").unix(),
  };
  return  jwt.encode(payload, config.TOKEN_SECRET, 'HS512');
};


module.exports = {
  createLogin
}


   
    
