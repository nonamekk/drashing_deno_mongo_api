import BaseResource from "../resources/base_resource.ts"
import ItemModel from "../models/item_model.ts";
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";

/*

    Get - get all items

    Get:name - get item by name

    Update - change item status to active for selling (only with owner item token)

    Post - search by name
*/

class InventoryResource extends BaseResource {
    static paths = [
        "/user/:username/inventory"
    ]

    public async GET() {

        const username = this.request.getPathParam("username") as string;

        // find by owner doesn't work - says im using cursortimeout :/
        const allItems = await ItemModel.getAll(0, 0); //sad face
        const onlyInventoryOwnerItems = allItems.filter( ({owner}) => owner === username);
        
        this.response.body = onlyInventoryOwnerItems;
        this.response.status_code = 200;

        return this.response;
    }
    public async POST() {
        // Get Token
        //const authorization = this.request.getHeaderParam("authorization");
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            return this.errorResponse(401, "Cookie monster ate your cookie!");
        }

        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "Unauthorized access");
        }
        const tokenUsername = payload.username as string || "";
        const headerUsername = this.request.getPathParam("username") as string;
        if (tokenUsername !== headerUsername) {
            return this.errorResponse(401, "Unauthorized access - you are not the owner of the inventory!");
        }
        // Get Params
        const itemId = ValidationService.decodeInput(this.request.getBodyParam("id") as string || "");
        if (!itemId) {
            return this.errorResponse(422, "Id field is required");
        }
        
        const id = itemId;
        var updatedOnSale;

        const item1 = await ItemModel.getById(id);
        if (!item1) {
            return this.errorResponse(401, "Item is no found before update");
        }

        if (item1.onSale) {
            updatedOnSale = false;
        } else {
            updatedOnSale = true;
        }

        const itemUpdated = {
            id,
            updatedOnSale
        };

        await ItemModel.update(itemUpdated);

        const item2 = await ItemModel.getById(id);
        if (!item2) {
            return this.errorResponse(401, "Item is not found after update");
        }

        this.response.body = item2.onSale;
        this.response.status_code = 201;
        return this.response;
    }
   
}

export default InventoryResource;