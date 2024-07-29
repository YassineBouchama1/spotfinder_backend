import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}

 async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    // bring request
    const request = context.switchToHttp().getRequest();
    // get token from request
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }


    
    try {
      // decode token
      const payload = await this.jwtService.verifyAsync(token);
      request.userId = payload.id;
      request.role = payload.role;

      // add validation if id exist
      
   

    } catch (e) {
      Logger.error(e.message);
      throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }

  // func for split token from bearer
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  }
  
}
