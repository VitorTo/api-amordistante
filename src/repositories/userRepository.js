const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'users';

const findByEmail = async (email) => {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ email });
};

const findById = async (id) => {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
};

const create = async (user) => {
  const db = getDb();
  const result = await db.collection(COLLECTION).insertOne(user);
  return { id: result.insertedId, ...user };
};

// Additional methods can be added as needed for user management

module.exports = {
  findByEmail,
  findById,
  create
}; 