const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const uploadImage = async (file, folder) => {
  try {
    // Gerar nome único para o arquivo
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    
    // Criar pasta se não existir
    const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
    await fs.mkdir(uploadPath, { recursive: true });
    
    // Salvar arquivo
    const filePath = path.join(uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);
    
    // Retornar URL relativa
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

module.exports = {
  uploadImage
}; 