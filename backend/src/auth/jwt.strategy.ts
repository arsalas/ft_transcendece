import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
		console.log('secret ','transcendence2023');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            ignoreExpiration: false,
            secretOrKey: 'transcendence2023'
        })
    }

    async validate(payload: any) {
        return { userId: payload.id, name: payload.name }
    }
}
// auth/jwt-auth.guard.ts