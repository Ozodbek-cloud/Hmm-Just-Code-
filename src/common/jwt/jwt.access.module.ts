import { Global, Module } from "@nestjs/common";
import { JwtAccessToken } from "../utils/jwt-utils";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
    imports: [JwtModule.register(JwtAccessToken)]
})

export class JwtAccessTokenModule {}