const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const imageUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// router.post('/', imageUpload, profileController.createProfile);
router.put('/:profileId', imageUpload, profileController.updateProfile);
router.get('/me', profileController.getMyProfile);
// router.get('/:profileId', profileController.getProfile);
// router.delete('/:profileId', profileController.deleteProfile);

module.exports = router; 