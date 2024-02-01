import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepo } from './company.repo';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepo, JwtService],
})
export class CompanyModule { }
