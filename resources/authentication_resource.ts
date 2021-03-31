import BaseResource from "../resources/base_resource.ts"
import TokenService from "../services/token_service.ts";

export default class AuthenticationResource extends BaseResource {
    static paths = [
        "/authentication",
    ]
    /*

        Get - show cookie owner username if exists, not return false

        Post - log out user, response deletes cookie

    */
    public async GET() {
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            this.response.body = false;
            this.response.status_code = 200;
            return this.response
        }
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            this.response.body = false;
            this.response.status_code = 200;
            return this.response
        }
        this.response.body = payload.username as string;
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