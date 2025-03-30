const i18n = {
  translations: {
    'en': {
      'Invalid credentials': 'Invalid credentials',
      'Email already in use': 'Email already in use',
      'Email and password are required': 'Email and password are required',
      'params invalid': 'Name, email and password are required',
      'User registered successfully': 'User registered successfully'
    },
    'pt-BR': {
      'Invalid credentials': 'Credenciais inválidas',
      'Email already in use': 'Email já está em uso',
      'Email and password are required': 'Email e senha são obrigatórios',
      'params invalid': 'Nome, email e senha são obrigatórios',
      'User registered successfully': 'Usuário registrado com sucesso'
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