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
  
  module.exports = {
    getOffset,
    emptyOrRows,
    isProductionEnv
  }