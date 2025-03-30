const i18n = {
  translations: {
    'en': {
      'Invalid credentials': 'Invalid credentials',
      'Email already in use': 'Email already in use',
      'Email and password are required': 'Email and password are required',
      'params invalid': 'Name, email and password are required',
      'User registered successfully': 'User registered successfully',
      'Invalid invite code': 'Invalid invite code',
      'Invite already used': 'This invite has already been used',
      'Invite expired': 'This invite has expired',
      'Joined successfully': 'You have joined the relationship successfully',
      'Invite code is required': 'Invite code is required',
      'Profile not found': 'Profile not found'
    },
    'pt-BR': {
      'Invalid credentials': 'Credenciais inválidas',
      'Email already in use': 'Email já está em uso',
      'Email and password are required': 'Email e senha são obrigatórios',
      'params invalid': 'Nome, email e senha são obrigatórios',
      'User registered successfully': 'Usuário registrado com sucesso',
      'Invalid invite code': 'Código de convite inválido',
      'Invite already used': 'Este convite já foi utilizado',
      'Invite expired': 'Este convite expirou',
      'Joined successfully': 'Você entrou no relacionamento com sucesso',
      'Invite code is required': 'O código de convite é obrigatório',
      'Profile not found': 'Perfil não encontrado'
    }
  },
  
  translate(key, lang = 'en') {
    if (!this.translations[lang] || !this.translations[lang][key]) {
      return key;
    }
    return this.translations[lang][key];
  }
};

const i18nMiddleware = (req, res, next) => {
  // Get language from header or default to English
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  
  // Add translation function to response locals
  res.locals.t = (key) => i18n.translate(key, lang);
  
  // Override res.json to translate error messages
  const originalJson = res.json;
  res.json = function(obj) {
    if (obj && obj.message) {
      obj.message = i18n.translate(obj.message, lang);
    }
    return originalJson.call(this, obj);
  };
  
  next();
};

module.exports = i18nMiddleware; 