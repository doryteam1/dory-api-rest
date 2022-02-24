const jwt = require("jwt-simple");
var moment = require("moment");
const config = require('./config');

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
  }
  
  function emptyOrRows(rows) {
    if (!rows) {
      return [];
    }
    return rows;
  }

  function isProductionEnv(){
    return process.env.NODE_ENV == 'production';
  }

  function createToken (user) {
    var payload = {
   email:user.email,
   sub: user.id,
   rol: user.nombre_tipo_usuario,
   iat: moment().unix(),
   exp: moment().add(14, "days").unix(),
  };
  return  jwt.encode(payload, config.TOKEN_SECRET);
  };
  
  function parseJwt(token) {
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  };

  module.exports = {
    getOffset,
    emptyOrRows,
    isProductionEnv,
    createToken,
    parseJwt
  }