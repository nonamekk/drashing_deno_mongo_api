import BaseResource from "../resources/base_resource.ts"
import TokenService from "../services/token_service.ts";
import ValidationService from "../services/validation_service.ts";
import ItemModel from "../models/item_model.ts";

class ItemResource extends BaseResource {
    static paths = [
        "/admin/items"
    ]

    public async POST() {
        
        // Verify token and get userrole
        const cookie = this.request.getCookie("JWT");
        if (!cookie) {
            return this.errorResponse(401, "Cookie monster ate your cookie!");
        }
        const payload = await TokenService.verifyToken(cookie);
        if (!payload) {
            return this.errorResponse(401, "Unauthorized access");
        }
        //const username = payload.username;
        const userRole = payload.role;
        // change to admin
        if (userRole != "default") {
            return this.errorResponse(401, "Unauthorized access");
        }

        // Get params
        const itemName = ValidationService.decodeInput(this.request.getBodyParam("name") as string) || "";
        const quantity = ValidationService.decodeInput(this.request.getBodyParam("quantity") as string || "")

        if (!itemName) {
            return this.errorResponse(422, "Name field is required");
        }
        if (!quantity) {
            return this.errorResponse(422, "Quantity field is required");
        }
        const setQuantity = Number(quantity);
        if (setQuantity < 1) {
            return this.errorResponse(422, "Quantity can't be less than 1");
        }

        // find the item
            // if item exist
                // add quantity of instances of that item specifying same price
            // trhow error

        const items = await ItemModel.getAllInShop(0,0);
        const onlySelectedNameItems = items.filter( ({name}) => name === itemName);
        if (!onlySelectedNameItems) {
            return this.errorResponse(422, "Initial item is not created");
        }
        else {
            const itemPrice = onlySelectedNameItems[0].price
            for (let i = 0; i <= setQuantity; i++) {
                const newItem = {
                    name: itemName,
                    price: itemPrice,
                    owner: "admin",
                    onSale: true,
                }
                await ItemModel.create(newItem)
            }
            this.response.body = setQuantity + " of item name: " + itemName + " are added";
            this.response.status_code = 201;
            return this.response;
        }
    }
}

export default ItemResource;