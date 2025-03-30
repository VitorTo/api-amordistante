const userRepository = require('../repositories/userRepository');
const crypto = require('crypto');

// Hash simples de senha - na produção, use BCRYPT ou ARGON2
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const login = async (email, password) => {
  // Encontre usuário por e -mail
  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Verifique senha
  const hashedPassword = hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid credentials');
  }
  
  // Retorne informações do usuário sem senha
  const { password: _, ...userWithoutPassword } = user;
  
  // Em uma implementação real, você geraria e retornaria um token JWT aqui
  return {
    user: userWithoutPassword,
    // token: generateToken(user)
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
  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  });
  
  // Remova a senha da resposta
  const { password: _, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};

module.exports = {
  login,
  register
}; 