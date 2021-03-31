import BaseResource from "../resources/base_resource.ts"
import UserModel from "../models/user_model.ts";
import ItemModel from "../models/item_model.ts";
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";

class ShopResource extends BaseResource {
    static paths = [
        "/",
    ]

    /*

        Get - get all item containers which have simplified view for user

        Post - sell item (change status, assign new owner) (only with token)

    */

    public async GET() {
        const items = await ItemModel.getAllInShop(0,0);

        const itemContainers = [];
        
        for (let x in items) {
            const a = itemContainers.findIndex(({name}) => name === items[x].name);

            if (a == -1) {
                itemContainers.push({name: items[x].name, quantity: 1, price: items[x].price})
            }
            else {
                itemContainers[a].quantity += 1;
            }
        }

        this.response.body = itemContainers;
        this.response.status_code = 201;

        return this.response;
        
    }

    public async POST() {
        // Get Token
        const cookie = this.request.getCookie("JWT");
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "Unauthorized access");
        }
        const username = payload.username as string || "";
        if (!username) {
            return this.errorResponse(401, "Unauthorized access");
        }
        // Get params
        const itemName = ValidationService.decodeInput(this.request.getBodyParam("name") as string || "");
        
        if (!itemName) {
            return this.errorResponse(422, "Name field is required")
        }
        
        const user = await UserModel.getByUsername(username);
        const item = await ItemModel.getByNameOnSale(itemName);

        if (!item) {
            return this.errorResponse(401, "All items are sold");
        }
        if (!user) {
            return this.errorResponse(500, "Username not found");
        }
        //const itemPrice = item.price;
        const id = item._id;
        

        const updatedOwner = username;
        const updatedOnSale = false;
        const itemUpdated = {
            id, 
            updatedOwner, 
            updatedOnSale
        };

        ItemModel.update(itemUpdated);

        this.response.body = id;
        this.response.status_code = 201;
        return this.response;


        
    }

}

export default ShopResource;