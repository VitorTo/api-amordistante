const profileService = require('../services/profileService');
const multer = require('multer');
const upload = multer();

const createProfile = async (req, res, next) => {
  try {
    const profileData = req.body;
    const files = {
      avatar: req.files?.avatar?.[0],
      coverImage: req.files?.coverImage?.[0]
    };
    
    const profile = await profileService.createProfile(profileData, files);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const updateData = req.body;
    const files = {
      avatar: req.files?.avatar?.[0],
      coverImage: req.files?.coverImage?.[0]
    };
    
    const profile = await profileService.updateProfile(profileId, updateData, files);
    res.json(profile);
  } catch (error) {
    if (error.message.includes('Profile not found')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const profile = await profileService.getProfileById(profileId);
    res.json(profile);
  } catch (error) {
    if (error.message === 'Profile not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Assumindo que temos o middleware de auth
    const profile = await profileService.getProfileByMember(userId);
    res.json(profile);
  } catch (error) {
    if (error.message === 'Profile not found for this user') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    await profileService.deleteProfile(profileId);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Profile not found') {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getProfile,
  getMyProfile,
  deleteProfile
}; 