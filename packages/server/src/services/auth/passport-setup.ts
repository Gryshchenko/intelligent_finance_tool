import { PassportStatic } from 'passport';
import { getConfig } from 'src/config/config';

import { Strategy as JwtStrategy, StrategyOptionsWithRequest, VerifiedCallback } from 'passport-jwt';
import UserServiceBuilder from 'src/services/user/UserServiceBuilder';

import { ExtractJwt } from 'passport-jwt';
import { Algorithm, JwtPayload } from 'jsonwebtoken';
import { ErrorCode } from 'tenpercent/shared';

export interface JwtPayloadCustom extends JwtPayload {
    sub: string;
    email?: string;
    iat?: number;
    exp?: number;
}

const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getConfig().jwtSecret,
    issuer: getConfig().jwtIssuer,
    audience: getConfig().jwtAudience,
    algorithms: [getConfig().jwtAlgorithm as Algorithm],
    passReqToCallback: true,
};

const passportSetup = (passport: PassportStatic) => {
    const userService = UserServiceBuilder.build();
    passport.use(
        new JwtStrategy(options, async (req, jwt_payload: JwtPayloadCustom, done: VerifiedCallback) => {
            try {
                const user = await userService.get(parseInt(jwt_payload.sub, 10));
                if (user?.userId) {
                    return done(null, user);
                }
                return done(null, false, { errorCode: ErrorCode.TOKEN_PAYLOAD_ERROR });
            } catch (error) {
                return done(error, false, { message: ErrorCode.TOKEN_INVALID_ERROR });
            }
        }),
    );
};

export default passportSetup;
