import BaseResource from "../resources/base_resource.ts"
import UserModel from "../models/user_model.ts";

class UserResource extends BaseResource {
    static paths = [
        "/:username",
    ]
    /*

        Get - show user profile

        Update - update user (only with token)

        Delete - delete user (only with token)

    */
    public async GET() {
        try {
            const username = this.request.getPathParam("username") as string;
            const userData = await UserModel.getByUsername(username);
            const profileData = {
                username: userData.username,
            }

            this.response.body = profileData;
            this.response.status_code = 200;
            return this.response;
        } catch {
            return this.errorResponse(404, "Not Found");
        }
    }
}

export default UserResource;