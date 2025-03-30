const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const dbConnection = async () => {
  try {
    if (db) return db;
    
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    console.log('Conexão com MongoDB estabelecida com sucesso');
    db = client.db();
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('É necessário conectar ao banco de dados antes de usá-lo');
  }
  return db;
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('Conexão com MongoDB fechada com sucesso');
  }
};

module.exports = { 
  dbConnection, 
  getDb,
  closeConnection 
}; 