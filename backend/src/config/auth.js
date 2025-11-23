import jwt from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'pengadaan_it_center_secret_key_2024',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

export const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { 
    expiresIn: jwtConfig.expiresIn 
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};