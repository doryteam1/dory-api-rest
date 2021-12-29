const mysql = require('mysql2/promise');
const config = require('../config');

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results, ] = await connection.execute(sql, params);

  return results;
}

async function newConnection(){
  const connection = await mysql.createConnection(config.db);
  return connection;
}

module.exports = {
  query,
  newConnection
}