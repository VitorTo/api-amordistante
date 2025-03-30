const userRepository = require('../repositories/userRepository');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Hash simples de senha - na produção, use BCRYPT ou ARGON2
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Função para gerar token JWT
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email
  };
  
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: '5h' } // Token expira em 5 horas
  );
};

const login = async (email, password) => {
  // Encontre usuário por e-mail
  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Verifique senha
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid credentials');
  }
  
  // Gerar token JWT
  const token = generateToken(user);
  
  // Retorne apenas informações mínimas do usuário
  return {
    user: {
      email: user.email,
      name: user.name
    },
    token
  };
};

const register = async (userData) => {
  // Check if user already exists
  const existingUser = await userRepository.findByEmail(userData.email);
  
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Senha de hash
  const hashedPassword = hashPassword(userData.password);
  
  // Crie novo usuário
  await userRepository.create({
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  });
  
  // Não retorna dados do usuário após o registro
  return { success: true };
};

module.exports = {
  login,
  register
}; 