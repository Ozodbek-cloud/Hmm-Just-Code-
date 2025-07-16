import { JwtSignOptions } from "@nestjs/jwt";
import * as dotenv from "dotenv"
dotenv.config()

export const JwtAccessToken: JwtSignOptions = {
   secret: process.env.JWT_SECRET,
   expiresIn: process.env.JWT_EXPIRE_IN
} 

export const JWtRefreshToken: JwtSignOptions = {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn:process.env.JWT_EXPIRE_IN
}