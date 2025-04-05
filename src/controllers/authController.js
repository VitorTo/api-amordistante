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
    
    // Configurações do cookie
    const cookieOptions = {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript no navegador
      secure: process.env.NODE_ENV === 'production', // Envia apenas em HTTPS no ambiente de produção
      maxAge: 5 * 60 * 60 * 1000, // 5 horas em milissegundos
      sameSite: 'Strict' // Protege contra CSRF
    };
    
    // Envia o token como um cookie
    res.cookie('jwt', result.token, cookieOptions);
    
    // Retorna apenas as informações do usuário
    res.json({ user: result.user });
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
    
    const result = await authService.register(userData);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const joinWithInvite = async (req, res, next) => {
  try {
    const { inviteCode } = req.params;
    const userData = req.body;
    
    // Verifica o convite antes de prosseguir
    await authService.verifyInvite(inviteCode);
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.name) {
      return res.status(400).json({ 
        message: 'params invalid' 
      });
    }
    
    await authService.joinWithInvite(inviteCode, userData);
    res.status(201).json({ message: 'Joined successfully' });
  } catch (error) {
    const errorMessages = [
      'Invalid invite code', 
      'Invite already used', 
      'Invite expired',
      'Email already in use',
      'Profile not found'
    ];
    
    if (errorMessages.includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    
    next(error);
  }
};

// Rota para verificar um código de convite antes do registro
const verifyInvite = async (req, res, next) => {
  try {
    const { inviteCode } = req.params;
    
    // Verifica se o código foi fornecido
    if (!inviteCode) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Invite code is required' 
      });
    }
    
    const inviteDetails = await authService.verifyInvite(inviteCode);
    
    res.json({ 
      valid: true, 
      invite: inviteDetails 
    });
    
  } catch (error) {
    res.status(400).json({ 
      valid: false, 
      message: error.message 
    });
  }
};

module.exports = {
  login,
  register,
  joinWithInvite,
  verifyInvite
}; 