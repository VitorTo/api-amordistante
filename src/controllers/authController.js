const authService = require('../services/authService');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/token.js');

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
const verifyInvite = async (req, res) => {
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


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    const { user } = await authService.login(email, password);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // //TODO: Armazene o refresh token num DB ou cache se quiser poder invalidar
    // authService.setRefreshToken(refreshToken);

    res
    .cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: process.env.REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

// Refresh endpoint
const refreshToken = async (req, res)  => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ message: 'No token' });

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await User.findById(payload.sub);
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ message: 'Refresh token não corresponde' });
  }

  const newAccessToken = signAccessToken({ sub: user.id, role: user.role });
  const newRefreshToken = signRefreshToken({ sub: user.id, role: user.role });
  user.setRefreshToken(newRefreshToken);
  await user.save();

  res
    .cookie('jid', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ accessToken: newAccessToken });
}

// Logout: limpa cookie e DB
const logout = async (req, res) => {
  const token = req.cookies.jid;
  if (token) {
    // opcionalmente, remova do DB
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (user) {
      user.setRefreshToken(null);
      await user.save();
    }
  }
  res.clearCookie('jid', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
     .json({ message: 'Desconectado' });
}

module.exports = {
  register,
  joinWithInvite,
  verifyInvite,
  login,
  logout,
  refreshToken,
}; 