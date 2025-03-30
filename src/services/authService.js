const userRepository = require('../repositories/userRepository');
const profileRepository = require('../repositories/profileRepository');
const inviteRepository = require('../repositories/inviteRepository');
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
  // Verifica se o e-mail já está em uso
  const existingUser = await userRepository.findByEmail(userData.email);
  
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Hash da senha
  const hashedPassword = hashPassword(userData.password);
  
  // Cria novo usuário
  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  });
  
  // Cria um novo perfil compartilhado
  const profile = await profileRepository.create({
    name: `${userData.name}'s Relationship`,
    createdBy: newUser.id
  });
  
  // Adiciona o usuário como membro do perfil
  await profileRepository.addMember(profile.id, newUser.id);
  
  // Gera um convite para o parceiro
  const invite = await inviteRepository.create(profile.id, newUser.id);
  
  // Gera a URL de convite que será compartilhada
  const inviteUrl = `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/auth/join/${invite.code}`;
  
  return { 
    success: true,
    inviteCode: invite.code,
    inviteUrl
  };
};

// Nova função para registrar o segundo membro através do convite
const joinWithInvite = async (inviteCode, userData) => {
  // Busca o convite pelo código
  const invite = await inviteRepository.findByCode(inviteCode);
  
  if (!invite) {
    throw new Error('Invalid invite code');
  }
  
  if (invite.isUsed) {
    throw new Error('Invite already used');
  }
  
  if (invite.expiresAt < new Date()) {
    throw new Error('Invite expired');
  }
  
  // Verifica se o e-mail já está em uso
  const existingUser = await userRepository.findByEmail(userData.email);
  
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Hash da senha
  const hashedPassword = hashPassword(userData.password);
  
  // Cria novo usuário
  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
    createdAt: new Date()
  });
  
  // Adiciona o novo usuário ao perfil associado ao convite
  await profileRepository.addMember(invite.profileId, newUser.id);
  
  // Marca o convite como usado
  await inviteRepository.markAsUsed(invite._id);
  
  return { success: true };
};

// Função para verificar convite
const verifyInvite = async (inviteCode) => {
  // Busca o convite pelo código
  const invite = await inviteRepository.findByCode(inviteCode);
  
  if (!invite) {
    throw new Error('Invalid invite code');
  }
  
  if (invite.isUsed) {
    throw new Error('Invite already used');
  }
  
  if (invite.expiresAt < new Date()) {
    throw new Error('Invite expired');
  }
  
  // Busca informações do perfil e do criador para exibir ao convidado
  const profile = await profileRepository.findById(invite.profileId);
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Busca informações básicas do usuário que criou o convite
  const creator = await userRepository.findById(invite.createdBy);
  
  // Retorna apenas informações seguras para o frontend
  return {
    inviteCode: invite.code,
    expiresAt: invite.expiresAt,
    createdAt: invite.createdAt,
    profileName: profile.name,
    invitedBy: creator ? creator.name : 'Unknown user'
  };
};

module.exports = {
  login,
  register,
  joinWithInvite,
  verifyInvite
}; 