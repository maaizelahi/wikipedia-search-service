import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validateToken } from 'src/helpers/token-validation';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Extract the token excluding 'Bearer '
      // Validate the token
      const decodedToken = validateToken(token);

      if (decodedToken) {
        // If the token is valid, attach user information to the request
        req['username'] = decodedToken.username;
        req['userId'] = decodedToken.userId;
        next();
        return;
      }
    }
    next();

    // If no valid token is found, send an unauthorized response
    // res.status(401).json({ message: 'Unauthorized' });
  }
}
