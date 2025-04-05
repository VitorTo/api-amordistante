const profileRepository = require('../repositories/profileRepository');
const { uploadImage } = require('../utils/imageUpload'); // Vamos criar este utilitário

const createProfile = async (profileData, files) => {
  try {
    // Upload das imagens se fornecidas
    let imageUrls = {};
    
    if (files?.avatar) {
      imageUrls.avatar = await uploadImage(files.avatar, 'avatars');
    }
    
    if (files?.coverImage) {
      imageUrls.coverImage = await uploadImage(files.coverImage, 'covers');
    }
    
    // Criar perfil com as URLs das imagens
    const profile = await profileRepository.create({
      ...profileData,
      ...imageUrls
    });
    
    return profile;
  } catch (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }
};

const updateProfile = async (profileId, updateData, files) => {
  try {
    let imageUrls = {};
    
    if (files?.avatar) {
      imageUrls.avatar = await uploadImage(files.avatar, 'avatars');
    }
    
    if (files?.coverImage) {
      imageUrls.coverImage = await uploadImage(files.coverImage, 'covers');
    }
    
    const updatedProfile = await profileRepository.update(profileId, {
      ...updateData,
      ...imageUrls
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