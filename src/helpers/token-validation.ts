import * as jwt from 'jsonwebtoken';

import config from 'config';

interface TokenPayload {
  userId: string;
  username: string;
  exp?: number;
}

export function validateToken(token: string): TokenPayload | null {
  try {
    const secretKey = config.jwt.secret;
    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, secretKey, {
      algorithms: ['HS256'],
    }) as TokenPayload;

    // Check if the token has expired
    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    return decodedToken;
  } catch (error) {
    // Token is invalid, has expired, or other verification error
    return null;
  }
}
