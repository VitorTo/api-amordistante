const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'profiles';

const create = async (profileData) => {
  const db = getDb();
  const result = await db.collection(COLLECTION).insertOne({
    ...profileData,
    createdAt: new Date(),
    members: [], // Inicialmente vazio, irá armazenar os IDs de usuários
    isComplete: false // Indica se ambos os parceiros já se registraram
  });
  
  return { id: result.insertedId, ...profileData };
};

const findById = async (id) => {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
};

const addMember = async (profileId, userId) => {
  const db = getDb();
  const profile = await findById(profileId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  const members = [...profile.members, userId];
  const isComplete = members.length >= 2;
  
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(profileId) },
    { 
      $set: { 
        members,
        isComplete,
        updatedAt: new Date()
      } 
    }
  );
  
  return await findById(profileId);
};

const findByMember = async (userId) => {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ members: userId });
};

module.exports = {
  create,
  findById,
  addMember,
  findByMember
}; 