import BaseResource from "../resources/base_resource.ts"
import TokenService from "../services/token_service.ts";
import UserModel from "../models/user_model.ts";

/*

    Get - show cookie owner username if exists, not return false

    Post - log out user, response deletes cookie

*/

export default class AuthenticationResource extends BaseResource {
    static paths = [
        "/authentication",
    ]

    public async GET() {
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            this.response.body = false;
            this.response.status_code = 401;
            return this.response
        }
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            this.response.body = false;
            this.response.status_code = 401;
            return this.response
        }


        const userData = await UserModel.getByUsername(payload.username as string);

        const values = {
            username: userData.username,
            ecash: userData.ecash,
        }

        this.response.body = values;
        this.response.status_code = 200;

        return this.response 
    }
    // Sign out
    public async POST() { 
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            return this.errorResponse(401, "Cookie monster ate your cookie!");
        }
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "??");
        }
        
        this.response.delCookie("JWT");
        return this.response
    }
}