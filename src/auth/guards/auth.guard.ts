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
    constructor(private jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        // bring request
        const request = context.switchToHttp().getRequest();
        // get token from request
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Invalid token');
        }


        try {

            // decode token 
            const payload = this.jwtService.verify(token);
            request.userId = payload.userId;
            request.role = payload.role;
            console.log(request.role)

        } catch (e) {
            Logger.error(e.message);
            throw new UnauthorizedException('Invalid Token');
        }

        return true;
    }


    // func for split token from bearer
    private extractTokenFromHeader(request: Request): string | undefined {
        return request.headers.authorization?.split(' ')[1];
    }


}