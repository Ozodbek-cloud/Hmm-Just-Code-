import { Global, Module } from "@nestjs/common";
import { JWtRefreshToken } from "../utils/jwt-utils";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
    imports: [JwtModule.register(JWtRefreshToken)]
})

export class JwtRefreshTokenModule {}