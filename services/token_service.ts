import {create, getNumericDate, verify, decode} from "../deps.ts";
import BaseResource from "../resources/base_resource.ts"
import {config as dotEnv} from "../config.ts";

// generate key
// verify key

interface IPayload {
    username: string;
    exp: number;
    [key: string]:unknown
}

export default class TokenService extends BaseResource {
    // finding by id in collection is faster
    // but I can write it faster using usernames :)
    static async generateToken(user: any) {
        const secret = dotEnv.jwtKey;
        return await create(
            { alg: "HS512", typ: "JWT"},
            {
                username: user.username,
                role: user.role || "default",
                exp:getNumericDate(60*60), // 3600 seconds = 1 hour
            }, 
            secret
        );
    }

    static async verifyToken(authorization: string | null) {
        if (!authorization) {
            return null;
        }
        // get token from authorization string
        //const token = this.getToken(authorization);
        //if (!token) {
        //    return null;
        //}

        // Verify token and get username
        const secret = dotEnv.jwtKey;
        const payload = await verify(authorization, secret, "HS512")
        if (!payload) {
            return null;
        }
        return payload
    }

    /*
    private static getToken(authorization: string) {
        // get token from authorization string
        if (!authorization) {
            return null;
        }
        const [method, token] = authorization.split(" ");
        if (method !== "Bearer") {
            return null;
        }
        if (!token) {
            return null;
        }
        return token;
    }
    */
} 