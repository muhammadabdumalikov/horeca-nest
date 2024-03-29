import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PersonType, UserRoles } from 'src/domain/user/enum/user.enum';
import { IUser } from 'src/domain/user/interface/user.interface';
import { UserService } from 'src/domain/user/user.service';

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

    const user = await this.userService.findOne(token.id);

    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    request.user = {
      id: user.id,
      phone: user.phone,
      first_name: user.first_name,
      last_name: user.last_name,
      legal_name: user.legal_name,
      full_name: user.person_type === PersonType.JURIDIC ? user.legal_name : `${user.first_name} ${user.last_name}`,
      role: UserRoles,
      auth_status: user.auth_status,
      super_user: user.super_user
};

    return true;
  }
}
