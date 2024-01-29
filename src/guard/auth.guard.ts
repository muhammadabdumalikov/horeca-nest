import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRoles } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';
import { UserService } from 'src/domain/user/user.service';
import { UserHasNotPermissionException } from 'src/errors/permission.error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    // tokenId = tokenId.substring('Bearer '.length);

    try {
      token = await this.jwtService.verifyAsync(token, {
        secret: `store-app`,
      });
    } catch (error) {
      throw new ForbiddenException();
    }

    const user: IUser = await this.userService.findOne(token.id);

    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    request.user = user;

    return true;
  }
}
