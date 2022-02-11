const mysql = require('mysql2/promise');
const config = require('../config');
const pool= mysql.createPool(config.db);

async function query(sql, params) {
  const results = await pool.query(sql, params);          
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