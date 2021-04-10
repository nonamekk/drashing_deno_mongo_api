import BaseResource from "../resources/base_resource.ts";
import ValidationService from "../services/validation_service.ts";
import { aes } from "../config.ts";
import UserModel from "../models/user_model.ts"
import TokenService from "../services/token_service.ts";

class RegistrationResource extends BaseResource {
    static paths = [
        "/registration"
    ]

    public async POST() {
        // Get params
        const email = ValidationService.decodeInput(this.request.getBodyParam("email") as string) || "";
        const username = ValidationService.decodeInput(this.request.getBodyParam("username") as string) || "";
        const rawPassword = ValidationService.decodeInput(this.request.getBodyParam("password") as string) || "";
 
        if (!email) {
            return this.errorResponse(422, "Email field is required");
        }
        if (!username) {
            return this.errorResponse(422, "Username field is required");
        }
        if (username == "admin") {
            return this.errorResponse(403, "Can't create user with username = admin");
        }
        if (!rawPassword) {
            return this.errorResponse(422, "Password field is required");
        }
        if (!ValidationService.isEmail(email)) {
            return this.errorResponse(422, "Email must be a valid email");
        }
        if (!(await ValidationService.isEmailUnique(email))) {
            return this.errorResponse(422, "Email is already taken");
        }
        if (!(await ValidationService.isUsernameUnique(username))) {
            return this.errorResponse(422, "Username is already taken");
        }
        if (rawPassword) {
            if (!ValidationService.isPasswordStrong(rawPassword)) {
                return this.errorResponse(422, "Password must be 8 characters long and include 1 number, 1" +
                "uppercase letter, and 1 lowercase leter.",
                );
            }
        }
        const hashedPassword = await aes.encrypt(rawPassword);
        const password = hashedPassword.hex();
        const role = "default";
        const ecash = 20;

        const newUser = {
            email,
            username,
            password,
            role,
            ecash
        }

        console.log("Creating user:");

        await UserModel.create(newUser)
        
        const token = await TokenService.generateToken(newUser)
        

        this.response.body = newUser.username;
        this.response.setCookie({
            name: "JWT",
            value: token,
            httpOnly: true,
            secure: false,
        });
        this.response.status_code = 201;
        

        console.log("User created, token received in the cookie")

        return this.response;
        
    }
}

export default RegistrationResource;