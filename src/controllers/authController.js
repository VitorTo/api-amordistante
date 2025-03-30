const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return res.status(400).json({ 
        message: 'params invalid' 
      });
    }
    
    await authService.register(userData);
    // Retorna apenas status 201 sem informações do usuário
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  login,
  register
}; 