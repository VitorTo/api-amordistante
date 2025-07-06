const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// router.post('/', imageUpload, profileController.createProfile);
router.put('/:profileId', profileController.updateProfile);
router.get('/me', profileController.getMyProfile);
// router.get('/:profileId', profileController.getProfile);
// router.delete('/:profileId', profileController.deleteProfile);

module.exports = router; 