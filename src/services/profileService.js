const profileRepository = require('../repositories/profileRepository');

const createProfile = async (profileData) => {
  try {
    // Criar perfil com as URLs das imagens
    const profile = await profileRepository.create({
      ...profileData
    });
    
    return profile;
  } catch (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }
};

const updateProfile = async (profileId, updateData) => {
  try {    
    const updatedProfile = await profileRepository.update(profileId, {
      ...updateData
    });
    
    return updatedProfile;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

const getProfileById = async (profileId) => {
  const profile = await profileRepository.findById(profileId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  return profile;
};

const getProfileByMember = async (userId) => {
  const profile = await profileRepository.findByMember(userId);
  
  if (!profile) {
    throw new Error('Profile not found for this user');
  }
  
  return profile;
};

const deleteProfile = async (profileId) => {
  const profile = await profileRepository.findById(profileId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  await profileRepository.deleteProfile(profileId);
  return { success: true };
};

module.exports = {
  createProfile,
  updateProfile,
  getProfileById,
  getProfileByMember,
  deleteProfile
}; 