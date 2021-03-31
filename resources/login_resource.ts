import BaseResource from "../resources/base_resource.ts"
import UserModel from "../models/user_model.ts"
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";

class LoginResource extends BaseResource {
    static paths = [
        "/login"
    ]

    public async POST() {
        const email = ValidationService.decodeInput(this.request.getBodyParam("email") as string) || "";
        const rawPassword = ValidationService.decodeInput(this.request.getBodyParam("password") as string) || "";
        
        if (!email) {
            return this.errorResponse(422, "Email field is required");
        }
        if (!rawPassword) {
            return this.errorResponse(422, "Password field is required");
        }
        if (!ValidationService.isEmail(email)) {
            return this.errorResponse(422, "Email must be a valid email");
        }

        const userExists = await UserModel.getByEmail(email);
        if (userExists) {
            if (!(await ValidationService.isPasswordCorrect(userExists.password, rawPassword))) {
                return this.errorResponse(401, "Wrong password");
            }

            const authUser = {
                username: userExists.username,
                role: userExists.role,
            }

            const token = await TokenService.generateToken(authUser)

            this.response.body = true;
            this.response.setCookie({
                name: "JWT",
                value: token,
                httpOnly: true,
                secure: false,
            });
            this.response.status_code = 201;
            
            console.log("User loged in, token created and sent in response")

            return this.response;
        }
        return this.errorResponse(401, "Wrong email");

    }
}

export default LoginResource;