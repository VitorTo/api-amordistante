const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

const COLLECTION = 'invites';

// Gera um código único para o convite
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

const create = async (profileId, createdBy) => {
  const db = getDb();
  
  const inviteCode = generateInviteCode();
  
  const invite = {
    profileId: new ObjectId(profileId),
    createdBy: new ObjectId(createdBy),
    code: inviteCode,
    isUsed: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expira em 7 dias
  };
  
  const result = await db.collection(COLLECTION).insertOne(invite);
  return { id: result.insertedId, ...invite };
};

const findByCode = async (code) => {
  const db = getDb();
  return await db.collection(COLLECTION).findOne({ code });
};

const markAsUsed = async (inviteId) => {
  const db = getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(inviteId) },
    { 
      $set: { 
        isUsed: true,
        usedAt: new Date() 
      } 
    }
  );
};

module.exports = {
  create,
  findByCode,
  markAsUsed,
  generateInviteCode
}; 