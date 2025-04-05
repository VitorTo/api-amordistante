const { getDb } = require('../config/database');
const { ObjectId } = require('mongodb');

const COLLECTION = 'profiles';

const create = async (profileData) => {
  const db = getDb();
  const profile = {
    ...profileData,
    createdAt: new Date(),
    members: [], // IDs dos usuários
    isComplete: false,
    milestoneDate: null,
    avatar: null,
    coverImage: null,
    updatedAt: new Date()
  };
  
  const result = await db.collection(COLLECTION).insertOne(profile);
  return { id: result.insertedId, ...profile };
};

const update = async (profileId, updateData) => {
  const db = getDb();
  const profile = await findById(profileId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  const updatedProfile = {
    ...updateData,
    updatedAt: new Date()
  };
  
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(profileId) },
    { $set: updatedProfile }
  );
  
  return await findById(profileId);
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
  
  // TODO: adicionar o nome alem do user id 
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
  return await db.collection(COLLECTION).findOne({ 
    members: new ObjectId(userId) 
  });
};

const updateImages = async (profileId, { avatar, coverImage }) => {
  const db = getDb();
  const updateObj = {};
  
  if (avatar) updateObj.avatar = avatar;
  if (coverImage) updateObj.coverImage = coverImage;
  updateObj.updatedAt = new Date();
  
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(profileId) },
    { $set: updateObj }
  );
  
  return await findById(profileId);
};

const deleteProfile = async (profileId) => {
  const db = getDb();
  return await db.collection(COLLECTION).deleteOne({ 
    _id: new ObjectId(profileId) 
  });
};

module.exports = {
  create,
  update,
  findById,
  findByMember,
  updateImages,
  deleteProfile,
  addMember
}; 